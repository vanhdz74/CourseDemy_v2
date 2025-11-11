package com.vanh.CourseWeb.service.impl;

import com.vanh.CourseWeb.configurations.MapperConfiguration;
import com.vanh.CourseWeb.dto.CourseDTO;
import com.vanh.CourseWeb.entity.CourseEntity;
import com.vanh.CourseWeb.entity.UserCourseEntity;
import com.vanh.CourseWeb.repository.CourseRepository;
import com.vanh.CourseWeb.repository.UserCourseRepository;
import com.vanh.CourseWeb.service.CourseService;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.awt.print.Pageable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final MapperConfiguration mapperConfiguration;
    private final UserCourseRepository userCourseRepository;

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
    public List<CourseDTO> getCoursesByTeacherId(Long teacherId) {
        List<CourseEntity> courseEntities = courseRepository.findByUser_id(teacherId);

        List<CourseDTO> result = new ArrayList<>();
        for (CourseEntity item : courseEntities) {
            CourseDTO course = mapperConfiguration.toCourseDTO(item);
            result.add(course);
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
    public List<CourseDTO> getCoursesByStudentId(Long studentId) {
        // Danh sách tìm thấy trong user_course
        List<UserCourseEntity> userCourseList = userCourseRepository.findByUserEntity_Id(studentId);

        // Kết quả trả về
        List<CourseDTO> result = new ArrayList<>();

        for (UserCourseEntity item : userCourseList) {
            CourseEntity courseEntity = item.getCourseEntity(); // Lấy khoá học từ quan hệ
            CourseDTO dto = mapperConfiguration.toCourseDTO(courseEntity); // Map sang DTO
            result.add(dto);
        }

        return result;
    }
}
