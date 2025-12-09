package com.vanh.CourseWeb.service.impl;

import com.vanh.CourseWeb.configurations.MapperConfiguration;
import com.vanh.CourseWeb.dto.CourseDTO;
import com.vanh.CourseWeb.dto.CourseDetailDTO;
import com.vanh.CourseWeb.dto.RevenueDTO;
import com.vanh.CourseWeb.entity.*;
import com.vanh.CourseWeb.repository.*;
import com.vanh.CourseWeb.service.CloudinaryService;
import com.vanh.CourseWeb.service.CourseService;
import com.vanh.CourseWeb.utils.ExtractUtils;
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
    public Map<String, Object> findAllHave(@RequestParam Map<String, String> params) {
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

        // --- Gói kết quả trả ra ---
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("courses", result);
//        response.put("currentPage", pageResult.getNumber() + 1);
        response.put("totalPages", pageResult.getTotalPages());
        response.put("totalElements", pageResult.getTotalElements());
//        response.put("pageSize", pageResult.getSize());

        return response;
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

        CoursesDetailEntity coursesDetailEntity = courseDetailRepository.findByCourseEntity_Id(courseEntity.getId());
        CourseDetailDTO dto = mapperConfiguration.toCourseDetailDTO(coursesDetailEntity);

        return dto;
    }

    @Override
    public void addCourse(CourseDTO courseDTO) {

        CourseEntity exist = courseRepository.findByTitle(courseDTO.getTitle());
        if (exist != null) throw new RuntimeException("Khoá học đã tồn tại");

        CategoryEntity category = categoryRepository.findByName(courseDTO.getCategoryName())
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        UserEntity user = userRepository.findById(courseDTO.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        // Create detail
        CoursesDetailEntity detail = new CoursesDetailEntity();

        // Create course
        CourseEntity course = new CourseEntity();
        course.setTitle(courseDTO.getTitle());
        course.setDescription(courseDTO.getDescription());
        course.setPrice(Double.valueOf(courseDTO.getPrice()));
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

        CategoryEntity categoryEntity = categoryRepository.findByName(courseDTO.getCategoryName())
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        UserEntity userEntity = userRepository.findById(courseDTO.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Ngừoi dùng không tồn tại"));

        courseEntity.setTitle(courseDTO.getTitle());
        courseEntity.setDescription(courseDTO.getDescription());
        courseEntity.setPrice(Double.valueOf(courseDTO.getPrice()));
        courseEntity.setUser(userEntity);
        courseEntity.setCategory(categoryEntity);

        courseRepository.save(courseEntity);
    }

    @Override
    public void updateFullCourse(long id, CourseDetailDTO courseDetailDTO) {
        CourseEntity courseEntity = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khoá học không tồn tại"));

        CategoryEntity categoryEntity = categoryRepository.findByName(courseDetailDTO.getCourse().getCategoryName())
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        UserEntity userEntity = userRepository.findById(courseDetailDTO.getCourse().getTeacherId())
                .orElseThrow(() -> new RuntimeException("Ngừoi dùng không tồn tại"));

        CourseImageEntity courseImageEntity =
                courseImageRepository.findByCourseEntity_Id(id)
                        .orElse(new CourseImageEntity());

        courseImageEntity.setCourseEntity(courseEntity);  // GÁN COURSE
        courseImageEntity.setImageUrl(courseDetailDTO.getCourse().getImageUrl());  // GÁN IMAGE

        courseImageRepository.save(courseImageEntity);  // LƯU LẠI


        courseEntity.setTitle(courseDetailDTO.getCourse().getTitle());
        courseEntity.setDescription(courseDetailDTO.getCourse().getDescription());
        courseEntity.setPrice(Double.valueOf(courseDetailDTO.getCourse().getPrice()));
        courseEntity.setLevel(courseDetailDTO.getCourse().getLevel());
        courseEntity.setCourseImageEntity(courseImageEntity);
        courseEntity.setCategory(categoryEntity);

        courseRepository.save(courseEntity);

        // 3. Lấy detail theo course_id
        CoursesDetailEntity detail =
                courseDetailRepository.findByCourseEntity_Id(id);

        if (detail == null) {
            detail = new CoursesDetailEntity();
        }

        // 4. Update detail
        detail.setContent(courseDetailDTO.getContent());
        detail.setDescription(courseDetailDTO.getDescription());
        detail.setRequest(courseDetailDTO.getRequest());
        detail.setCourseInclude(courseDetailDTO.getCourseInclude());

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
}
