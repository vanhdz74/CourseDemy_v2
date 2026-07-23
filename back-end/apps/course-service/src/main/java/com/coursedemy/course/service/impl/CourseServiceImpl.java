package com.coursedemy.course.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.coursedemy.course.mapper.MapperConfiguration;
import com.coursedemy.course.dto.CourseDTO;
import com.coursedemy.course.dto.CourseDetailDTO;
import com.coursedemy.course.dto.RevenueDTO;
import com.coursedemy.course.dto.response.PageResponse;
import com.coursedemy.course.entity.*;
import com.coursedemy.course.repository.*;
import com.coursedemy.course.service.CloudinaryService;
import com.coursedemy.course.service.CourseService;
import com.coursedemy.course.util.ExtractUtils;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.awt.print.Pageable;
import java.io.IOException;
import java.util.*;


@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final MapperConfiguration mapperConfiguration;
    private final UserCourseRepository userCourseRepository;
    private final CourseDetailRepository courseDetailRepository;
    private final CourseImageRepository courseImageRepository;
    private final OrderRepository orderRepository;


    @Value("${course.limit}")
    private String courseLimit;

    @Override
    public PageResponse<CourseDTO> findAllHave(@RequestParam Map<String, String> params) {
        Specification<CourseEntity> spec = Specification.where(null);

        if (params.containsKey("keyword")) {
            String keyword = params.get("keyword");
            if (keyword != null && !keyword.isBlank()) {
                String kw = "%" + keyword.toLowerCase() + "%";

                spec = spec.and((root, query, cb) -> {
                    // Join sang bảng category
                    var categoriesJoin = root.join("category", JoinType.INNER);

                    return cb.or(
                            cb.like(cb.lower(root.get("title")), kw),
                            cb.like(cb.lower(root.get("description")), kw),
                            cb.like(cb.lower(categoriesJoin.get("name")), kw) // tìm theo tên category
                    );
                });
            }
        }

        // --- Lọc theo teacherId ---
        if (params.containsKey("teacher_id")) {
            Long teacherId = Long.parseLong(params.get("teacher_id"));
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("user").get("id"), teacherId)
            );
        }

        // Lọc theo categoryId
        if (params.containsKey("category_id")) {
            Integer categoryId = Integer.parseInt(params.get("category_id"));
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("category").get("id"), categoryId)
            );
        }

        // Lọc theo mức giá (minPrice / maxPrice)
        if (params.containsKey("min_price")) {
            Double minPrice = Double.parseDouble(params.get("min_price"));
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("price"), minPrice)
            );
        }

        if (params.containsKey("max_price")) {
            Double maxPrice = Double.parseDouble(params.get("max_price"));
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("price"), maxPrice)
            );
        }

        // Phân trang
        int page = 0;
        int size = Integer.parseInt(courseLimit);

        if (params.containsKey("p")) {
            page = Integer.parseInt(params.get("p")) - 1;
        }
        PageRequest pageable = PageRequest.of(page, size);
        Page<CourseEntity> pageResult = courseRepository.findAll(spec, pageable);

        // Lấy danh sách khoá học trong trang hiện tại
        List<CourseEntity> courseEntities = pageResult.getContent();

        // Chuyển sang DTO
        List<CourseDTO> result = new ArrayList<>();
        for (CourseEntity item : courseEntities) {
            CourseDTO course = mapperConfiguration.toCourseDTO(item);
            result.add(course);
        }

        return PageResponse.from(pageResult, result);
    }

    @Override
    public List<CourseDTO> getCoursesByCategoryId(Integer categoryId) {
        List<CourseEntity> courseEntities = courseRepository.findByCategoryId(categoryId);

        List<CourseDTO> result = new ArrayList<>();
        for (CourseEntity item : courseEntities) {
            CourseDTO course = mapperConfiguration.toCourseDTO(item);
            result.add(course);
        }
        return result;
    }

    @Override
    public List<CourseDTO> getCoursesByUserId(Long userId) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Ngừoi dùng không tồn tại"));

        List<CourseDTO> result = new ArrayList<>();

        if (Objects.equals(userEntity.getRoleEntity().getRoleName(), "ADMIN")) {
            List<CourseEntity> courseEntities = courseRepository.findAll();

            for (CourseEntity item : courseEntities) {
                CourseDTO course = mapperConfiguration.toCourseDTO(item);
                result.add(course);
            }
        }

        if (Objects.equals(userEntity.getRoleEntity().getRoleName(), "TEACHER")) {
            List<CourseEntity> courseEntities = courseRepository.findByUser_id(userId);

            for (CourseEntity item : courseEntities) {
                CourseDTO course = mapperConfiguration.toCourseDTO(item);
                result.add(course);
            }
        }

        if (Objects.equals(userEntity.getRoleEntity().getRoleName(), "STUDENT")) {
            // Danh sách tìm thấy trong user_course
            List<UserCourseEntity> userCourseList = userCourseRepository.findByUserEntity_Id(userId);

            for (UserCourseEntity item : userCourseList) {
                CourseEntity courseEntity = item.getCourseEntity(); // Lấy khoá học từ quan hệ
                CourseDTO dto = mapperConfiguration.toCourseDTO(courseEntity); // Map sang DTO
                result.add(dto);
            }
        }

        return result;
    }

    @Override
    public CourseDTO getCourseById(Long id) {
        CourseEntity courseEntity = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoá học " + id));

        CourseDTO result = mapperConfiguration.toCourseDTO(courseEntity);
        return result;
    }

    @Override
    public CourseDetailDTO getCourseDetailByCourseId(Long id) {
        CourseEntity courseEntity = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khoá học không tồn tại"));

        CoursesDetailEntity coursesDetailEntity = getOrCreateCourseDetail(courseEntity.getId(), courseEntity);
        if (coursesDetailEntity.getId() == null) {
            coursesDetailEntity = courseDetailRepository.save(coursesDetailEntity);
        }
        CourseDetailDTO dto = mapperConfiguration.toCourseDetailDTO(coursesDetailEntity);

        return dto;
    }

    // Thêm khoá học
    @Override
    public void addCourse(CourseDTO courseDTO) {
        if (courseDTO.getTitle() == null || courseDTO.getTitle().isBlank()) {
            throw new RuntimeException("Tên khoá học không được để trống");
        }

        if (courseDTO.getCategoryId() == null) {
            throw new RuntimeException("Danh mục không được để trống");
        }

        if (courseDTO.getTeacherId() == null) {
            throw new RuntimeException("Giảng viên phụ trách không được để trống");
        }

        String title = courseDTO.getTitle().trim();
        if (courseRepository.existsByTitleIgnoreCase(title)) {
            throw new RuntimeException("Khoá học đã tồn tại");
        }

        CategoryEntity category = resolveCategory(courseDTO);

        UserEntity user = userRepository.findById(courseDTO.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        // Create detail
        CoursesDetailEntity detail = new CoursesDetailEntity();
        detail.setContent("");
        detail.setDescription("");
        detail.setRequest("");
        detail.setCourseInclude("");

        Double price = isBlank(courseDTO.getPrice()) ? 0D : parsePrice(courseDTO.getPrice());

        // Create course
        CourseEntity course = new CourseEntity();
        course.setTitle(title);
        course.setDescription(courseDTO.getDescription() == null ? "" : courseDTO.getDescription().trim());
        course.setPrice(price);
        course.setLevel(courseDTO.getLevel() == null ? 0 : courseDTO.getLevel());
        course.setQuantity(courseDTO.getQuantity() == null ? 0 : courseDTO.getQuantity().intValue());
        course.setCreatedAt(new Date());
        course.setUpdateAt(new Date());
        course.setUser(user);
        course.setCategory(category);

        // Set mapping 2 chiều
        course.setCoursesDetailEntity(detail);
        detail.setCourseEntity(course);

        // Chỉ save course (nếu có cascade)
        courseRepository.save(course);
    }


    @Override
    public void deleteCourseById(Long id) {
        CourseEntity courseEntity = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khoá học không tồn tại"));

        courseRepository.delete(courseEntity);
    }

    @Override
    public void updateCourse(long id, CourseDTO courseDTO) {
        CourseEntity courseEntity = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khoá học không tồn tại"));

        if (!isBlank(courseDTO.getTitle())) {
            String title = courseDTO.getTitle().trim();
            CourseEntity exist = courseRepository.findByTitle(title);
            if (exist != null && !Objects.equals(exist.getId(), courseEntity.getId())) {
                throw new RuntimeException("Khoá học đã tồn tại");
            }
            courseEntity.setTitle(title);
        }

        if (courseDTO.getDescription() != null) {
            courseEntity.setDescription(courseDTO.getDescription().trim());
        }

        if (!isBlank(courseDTO.getPrice())) {
            courseEntity.setPrice(parsePrice(courseDTO.getPrice()));
        }

        if (courseDTO.getLevel() != null) {
            courseEntity.setLevel(courseDTO.getLevel());
        }

        if (courseDTO.getQuantity() != null) {
            courseEntity.setQuantity(courseDTO.getQuantity().intValue());
        }

        if (courseDTO.getTeacherId() != null) {
            UserEntity userEntity = userRepository.findById(courseDTO.getTeacherId())
                    .orElseThrow(() -> new RuntimeException("Ngừoi dùng không tồn tại"));
            courseEntity.setUser(userEntity);
        }

        if (courseDTO.getCategoryId() != null) {
            courseEntity.setCategory(resolveCategory(courseDTO));
        }

        courseRepository.save(courseEntity);
    }

    @Override
    public void updateFullCourse(long id, JsonNode body) {
        CourseEntity courseEntity = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khoá học không tồn tại"));

        JsonNode courseNode = body != null && body.has("course") && body.get("course").isObject()
                ? body.get("course")
                : null;

        CourseImageEntity courseImageEntity =
                courseImageRepository.findByCourseEntity_Id(id)
                        .orElse(new CourseImageEntity());

        String imageUrl = readText(courseNode, "course_img", "imageUrl");
        if (courseNode != null && imageUrl != null) {
            courseImageEntity.setCourseEntity(courseEntity);  // GÁN COURSE
            courseImageEntity.setImageUrl(imageUrl);  // GÁN IMAGE
            courseImageRepository.save(courseImageEntity);  // LƯU LẠI
            courseEntity.setCourseImageEntity(courseImageEntity);
        }


        if (courseNode != null && hasAny(courseNode, "title")) {
            String title = readText(courseNode, "title");
            if (isBlank(title)) {
                throw new RuntimeException("Tên khoá học không được để trống");
            }
            CourseEntity exist = courseRepository.findByTitle(title.trim());
            if (exist != null && !Objects.equals(exist.getId(), courseEntity.getId())) {
                throw new RuntimeException("Khoá học đã tồn tại");
            }
            courseEntity.setTitle(title.trim());
        }

        if (courseNode != null && hasAny(courseNode, "description")) {
            String description = readText(courseNode, "description");
            courseEntity.setDescription(description == null ? "" : description.trim());
        }

        if (courseNode != null && hasAny(courseNode, "price")) {
            String price = readText(courseNode, "price");
            if (!isBlank(price)) {
                courseEntity.setPrice(parsePrice(price));
            }
        }

        if (courseNode != null && hasAny(courseNode, "level")) {
            Integer level = readInt(courseNode, "level");
            if (level == null) {
                throw new RuntimeException("Cấp độ khoá học không hợp lệ");
            }
            courseEntity.setLevel(level);
        }

        if (courseNode != null && hasAny(courseNode, "category_id", "categoryId")) {
            Integer categoryId = readInt(courseNode, "category_id", "categoryId");
            CourseDTO courseDTO = new CourseDTO();
            courseDTO.setCategoryId(categoryId);
            courseEntity.setCategory(resolveCategory(courseDTO));
        }

        courseEntity.setUpdateAt(new Date());
        courseRepository.save(courseEntity);

        // 3. Lấy detail theo course_id
        CoursesDetailEntity detail = getOrCreateCourseDetail(id, courseEntity);

        // 4. Update detail
        if (hasAny(body, "content")) {
            detail.setContent(readText(body, "content"));
        }

        if (hasAny(body, "description")) {
            detail.setDescription(readText(body, "description"));
        }

        if (hasAny(body, "request")) {
            detail.setRequest(readText(body, "request"));
        }

        if (hasAny(body, "course_include", "courseInclude")) {
            detail.setCourseInclude(readText(body, "course_include", "courseInclude"));
        }

        // 5. Gán lại courseEntity (entity thật)
        detail.setCourseEntity(courseEntity);

        // 6. Lưu
        courseDetailRepository.save(detail);
    }

    @Override
    public String uploadImg(Long id, MultipartFile file) throws IOException {
        // 1. Tìm user theo ID
        CourseEntity courseEntity = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoá học"));

        // 2. Xóa img cũ nếu có
        if (courseEntity.getCourseImageEntity() != null) {
            String publicId = ExtractUtils.extractPublicIdFromUrl(courseEntity.getCourseImageEntity().getImageUrl());
            if (publicId != null) {
                cloudinaryService.deleteFile(publicId);
            }
        }

        // 3. Upload img mới lên Cloudinary - tạo url
        Map<String, String> uploadResult = cloudinaryService.uploadImage(file);
        String newUrl = uploadResult.get("url");

        return newUrl;
    }

    @Override
    public Double getAverageRatingByCourseId(Long courseId) {
        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Khoá học không tồn tại"));

        return 5.0;
    }

    @Override
    public List<RevenueDTO.TopCourseDTO> getTopCoursesRevenue() {
        return orderRepository.getTopCoursesRevenue();
    }

    // Tìm danh mục
    private CategoryEntity resolveCategory(CourseDTO courseDTO) {
        if (courseDTO.getCategoryId() == null) {
            throw new RuntimeException("Danh mục không được để trống");
        }

        return categoryRepository.findById(courseDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
    }

    private CoursesDetailEntity getOrCreateCourseDetail(Long courseId, CourseEntity courseEntity) {
        List<CoursesDetailEntity> details = courseDetailRepository.findAllByCourseEntity_Id(courseId);

        if (details.isEmpty()) {
            CoursesDetailEntity detail = new CoursesDetailEntity();
            detail.setCourseEntity(courseEntity);
            return detail;
        }

        CoursesDetailEntity detail = details.get(0);
        if (details.size() > 1) {
            courseDetailRepository.deleteAll(details.subList(1, details.size()));
        }
        return detail;
    }

    private boolean hasAny(JsonNode node, String... fields) {
        if (node == null || node.isNull()) {
            return false;
        }

        for (String field : fields) {
            if (node.has(field)) {
                return true;
            }
        }

        return false;
    }

    private String readText(JsonNode node, String... fields) {
        if (node == null || node.isNull()) {
            return null;
        }

        for (String field : fields) {
            JsonNode value = node.get(field);
            if (value == null) {
                continue;
            }
            if (value.isNull()) {
                return null;
            }
            return value.asText();
        }

        return null;
    }

    private Integer readInt(JsonNode node, String... fields) {
        String value = readText(node, fields);
        if (isBlank(value)) {
            return null;
        }

        try {
            return Integer.valueOf(value.trim());
        } catch (NumberFormatException ex) {
            throw new RuntimeException("Giá trị số không hợp lệ");
        }
    }

    private Double parsePrice(String price) {
        try {
            return Double.valueOf(price.trim());
        } catch (NumberFormatException ex) {
            throw new RuntimeException("Giá khoá học không hợp lệ");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
