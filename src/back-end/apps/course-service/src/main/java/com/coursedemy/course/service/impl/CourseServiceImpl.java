package com.coursedemy.course.service.impl;

import com.coursedemy.course.dto.*;
import com.coursedemy.course.dto.response.PageResponse;
import com.coursedemy.course.client.OrderClient;
import com.coursedemy.course.client.UserClient;
import com.coursedemy.course.entity.*;
import com.coursedemy.course.mapper.MapperConfiguration;
import com.coursedemy.course.repository.*;
import com.coursedemy.course.service.CloudinaryService;
import com.coursedemy.course.service.CourseService;
import com.coursedemy.course.util.ExtractUtils;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {
    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final CourseDetailRepository courseDetailRepository;
    private final CourseImageRepository courseImageRepository;
    private final ReviewRepository reviewRepository;
    private final CloudinaryService cloudinaryService;
    private final MapperConfiguration mapperConfiguration;
    private final UserClient userClient;
    private final OrderClient orderClient;

    @Value("${course.limit:9}")
    private String courseLimit;

    @Override
    public PageResponse<CourseDTO> findAllHave(@RequestParam Map<String, String> params) {
        Specification<CourseEntity> spec = Specification.where(null);
        String keyword = params.get("keyword");
        if (!blank(keyword)) {
            String like = "%" + keyword.trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("title")), like),
                    cb.like(cb.lower(root.get("description")), like),
                    cb.like(cb.lower(root.join("category").get("name")), like)));
        }
        if (params.containsKey("teacher_id")) {
            Long teacherId = longValue(params.get("teacher_id"), "Giảng viên không hợp lệ");
            spec = spec.and((root, query, cb) -> cb.equal(root.get("teacherId"), teacherId));
        }
        if (params.containsKey("category_id")) {
            Integer categoryId = intValue(params.get("category_id"), "Danh mục không hợp lệ");
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("id"), categoryId));
        }
        if (params.containsKey("min_price")) {
            BigDecimal value = price(params.get("min_price"));
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), value));
        }
        if (params.containsKey("max_price")) {
            BigDecimal value = price(params.get("max_price"));
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), value));
        }
        int page = params.containsKey("p") ? Math.max(0, intValue(params.get("p"), "Trang không hợp lệ") - 1) : 0;
        Page<CourseEntity> result = courseRepository.findAll(spec, PageRequest.of(page, Math.max(1, intValue(courseLimit, "course.limit không hợp lệ"))));
        return PageResponse.from(result, result.getContent().stream().map(mapperConfiguration::toCourseDTO).toList());
    }

    @Override public List<CourseDTO> getCoursesByCategoryId(Long id) {
        //mapperConfiguration::toCourseDTO tương đương courseEntity -> mapperConfiguration.toCourseDTO(courseEntity)
        return courseRepository.findByCategoryId(id).stream().map(mapperConfiguration::toCourseDTO).toList();
    }

    @Override public List<CourseDTO> getCoursesByUserId(Long userId) {
        String role = userClient.getRoleByUserId(userId).getData();
        if ("ADMIN".equals(role)) {
            return courseRepository.findAll().stream().map(mapperConfiguration::toCourseDTO).toList();
        }
        if ("TEACHER".equals(role)) {
            return courseRepository.findAll((root, query, cb) -> cb.equal(root.get("teacherId"), userId))
                    .stream().map(mapperConfiguration::toCourseDTO).toList();
        }
        if ("STUDENT".equals(role)) {
            List<Long> courseIds = userClient.getCourseIdsByUserId(userId).getData();
            if (courseIds == null || courseIds.isEmpty()) return List.of();
            return courseRepository.findAllById(courseIds).stream().map(mapperConfiguration::toCourseDTO).toList();
        }
        return List.of();
    }

    @Override public CourseDTO getCourseById(Long id) { return mapperConfiguration.toCourseDTO(course(id)); }

    @Override public CourseDetailDTO getCourseDetailByCourseId(Long id) {
        return mapperConfiguration.toCourseDetailDTO(detail(course(id)));
    }

    @Override public void addCourse(CourseDTO dto) {
        if (blank(dto.getTitle())) throw new IllegalArgumentException("Tên khóa học không được để trống");
        if (dto.getTeacherId() == null) throw new IllegalArgumentException("Giảng viên phụ trách không được để trống");
        String title = dto.getTitle().trim();
        if (courseRepository.existsByTitleIgnoreCase(title)) throw new IllegalArgumentException("Khóa học đã tồn tại");
        CategoryEntity categoryEntity=categoryRepository.findById(dto.getCategoryId()).orElse(null);
        CourseEntity entity = CourseEntity.builder().title(title)
                .description(dto.getDescription() == null ? "" : dto.getDescription().trim())
                .price(blank(dto.getPrice()) ? BigDecimal.ZERO : price(dto.getPrice()))
                .level(dto.getLevel() == null ? 0 : dto.getLevel())
                .quantity(dto.getQuantity() == null ? 0 : dto.getQuantity().intValue())
                .teacherId(dto.getTeacherId())
                .category(categoryEntity).build();
        CoursesDetailEntity detail = CoursesDetailEntity.builder().courseEntity(entity)
                .content("").description("").request("").courseInclude("").build();
        entity.setCoursesDetailEntity(detail);
        courseRepository.save(entity);
    }

    @Override public void deleteCourseById(Long id) { courseRepository.delete(course(id)); }

    @Override public void updateCourse(long id, CourseDTO dto) {
        CourseEntity entity = course(id);
        if (!blank(dto.getTitle())) {
            CourseEntity sameTitle = courseRepository.findByTitle(dto.getTitle().trim());
            if (sameTitle != null && !Objects.equals(sameTitle.getId(), entity.getId())) throw new IllegalArgumentException("Khóa học đã tồn tại");
            entity.setTitle(dto.getTitle().trim());
        }
        if (dto.getDescription() != null) entity.setDescription(dto.getDescription().trim());
        if (!blank(dto.getPrice())) entity.setPrice(price(dto.getPrice()));
        if (dto.getLevel() != null) entity.setLevel(dto.getLevel());
        if (dto.getQuantity() != null) entity.setQuantity(dto.getQuantity().intValue());
        if (dto.getTeacherId() != null) entity.setTeacherId(dto.getTeacherId());
        if (dto.getCategoryId() != null) entity.setCategory(categoryRepository.findById(dto.getCategoryId()).orElse(null));
        courseRepository.save(entity);
    }

    @Override
    @Transactional
    public void updateFullCourse(long id, JsonNode body) {

        // 1. Kiểm tra Course tồn tại
        CourseEntity entity = course(id);

        // =========================================================
        // 2. UPDATE COURSE
        // =========================================================

        JsonNode courseNode = //JsonNode có dạng 1 object 
                body != null
                        && body.path("course").isObject()
                        ? body.path("course")
                        : null;

        if (courseNode != null) {

            CourseDTO dto = new CourseDTO();

            // Title
            if (courseNode.has("title")) {
                dto.setTitle(
                        text(courseNode, "title")
                );
            }

            // Price
            if (courseNode.has("price")) {
                dto.setPrice(
                        text(courseNode, "price")
                );
            }

            // Level
            if (courseNode.has("level")) {
                dto.setLevel(
                        Integer(courseNode, "level")
                );
            }

            // Category
            if (courseNode.has("category_id")
                    || courseNode.has("categoryId")) {

                dto.setCategoryId(
                        Long(
                                courseNode,
                                "category_id",
                                "categoryId"
                        )
                );
            }

            // Description
            if (courseNode.has("description")) {

                dto.setDescription(
                        text(
                                courseNode,
                                "description"
                        )
                );
            }

            // Cập nhật Course
            updateCourse(
                    id,
                    dto
            );

            // =====================================================
            // 3. UPDATE COURSE IMAGE
            // =====================================================

            String imageUrl =
                    text(
                            courseNode,
                            "course_img",
                            "imageUrl"
                    );

            if (!blank(imageUrl)) {

                saveImage(
                        entity,
                        imageUrl
                );
            }
        }

        // =========================================================
        // 4. UPDATE COURSE DETAIL
        // =========================================================

        CoursesDetailEntity detail =
                detail(entity);

        if (has(body, "content")) {

            detail.setContent(
                    text(
                            body,
                            "content"
                    )
            );
        }

        if (has(body, "description")) {

            detail.setDescription(
                    text(
                            body,
                            "description"
                    )
            );
        }

        if (has(body, "request")) {

            detail.setRequest(
                    text(
                            body,
                            "request"
                    )
            );
        }

        if (has(
                body,
                "course_include",
                "courseInclude"
        )) {

            detail.setCourseInclude(
                    text(
                            body,
                            "course_include",
                            "courseInclude"
                    )
            );
        }

        courseDetailRepository.save(
                detail
        );
    }

    @Override public String uploadImg(Long id, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("File ảnh không được để trống");
        CourseEntity entity = course(id);
        String oldUrl = courseImageRepository.findByCourseEntity_Id(id).map(CourseImageEntity::getImageUrl).orElse(null);
        String newUrl = cloudinaryService.uploadImage(file).get("url");
        if (blank(newUrl)) throw new IOException("Không nhận được URL ảnh từ Cloudinary");
        saveImage(entity, newUrl);
        if (!blank(oldUrl)) { String publicId = ExtractUtils.extractPublicIdFromUrl(oldUrl); if (publicId != null) cloudinaryService.deleteFile(publicId); }
        return newUrl;
    }

    @Override public Double getAverageRatingByCourseId(Long courseId) {
        course(courseId);
        return reviewRepository.findByCourseEntity_Id(courseId).stream().map(ReviewEntity::getRating).filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue).average().orElse(0D);
    }
    @Override public List<RevenueDTO.TopCourseDTO> getTopCoursesRevenue() {
        List<RevenueDTO.TopCourseDTO> result = orderClient.getTopCoursesRevenue().getData();
        return result == null ? List.of() : result;
    }
    @Override public void increaseQuantity(Long id) { CourseEntity c = course(id); c.setQuantity((c.getQuantity() == null ? 0 : c.getQuantity()) + 1); courseRepository.save(c); }
    @Override public void decreaseQuantity(Long id) { CourseEntity c = course(id); c.setQuantity(Math.max(0, (c.getQuantity() == null ? 0 : c.getQuantity()) - 1)); courseRepository.save(c); }

    private CourseEntity course(Long id) { return courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Khóa học không tồn tại")); }
    private CategoryEntity category(Long id) { if (id == null) throw new IllegalArgumentException("Danh mục không được để trống"); return categoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Danh mục không tồn tại")); }
    private CoursesDetailEntity detail(CourseEntity course) { CoursesDetailEntity d = courseDetailRepository.findByCourseEntity_Id(course.getId()); return d != null ? d : courseDetailRepository.save(CoursesDetailEntity.builder().courseEntity(course).content("").description("").request("").courseInclude("").build()); }
    private void saveImage(CourseEntity course, String url) { CourseImageEntity image = courseImageRepository.findByCourseEntity_Id(course.getId()).orElseGet(CourseImageEntity::new); image.setCourseEntity(course); image.setImageUrl(url); course.setCourseImageEntity(courseImageRepository.save(image)); }
    private static boolean has(JsonNode node, String... fields) { for (String f : fields) if (node != null && node.has(f)) return true; return false; }
    private static String text(JsonNode node, String... fields) { for (String f : fields) if (node != null && node.has(f) && !node.get(f).isNull()) return node.get(f).asText(); return null; }
    private static Long Long(JsonNode node, String... fields) { String value = text(node, fields); return blank(value) ? null : longValue(value, "Giá trị số không hợp lệ"); }
    private static Integer Integer(JsonNode node, String... fields) { String value = text(node, fields); return blank(value) ? null : intValue(value, "Giá trị số không hợp lệ"); }
    private static Integer intValue(String value, String error) { try { return Integer.valueOf(value.trim()); } catch (Exception e) { throw new IllegalArgumentException(error); } }
    private static Long longValue(String value, String error) { try { return Long.valueOf(value.trim()); } catch (Exception e) { throw new IllegalArgumentException(error); } }
    private static BigDecimal price(String value) { try { BigDecimal v = new BigDecimal(value.trim()); if (v.signum() < 0) throw new NumberFormatException(); return v.setScale(2, RoundingMode.HALF_UP); } catch (Exception e) { throw new IllegalArgumentException("Giá khóa học không hợp lệ"); } }
    private static boolean blank(String value) { return value == null || value.isBlank(); }
}
