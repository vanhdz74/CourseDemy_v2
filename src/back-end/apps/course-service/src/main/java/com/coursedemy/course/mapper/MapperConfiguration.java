package com.coursedemy.course.mapper;

import com.coursedemy.course.client.UserClient;
import com.coursedemy.course.dto.*;
import com.coursedemy.course.entity.*;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class MapperConfiguration {
    private final UserClient userClient;
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();

        // Giới hạn chỉ map các field cần thiết
        mapper.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setSkipNullEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        

        // Cấu hình map riêng cho CourseEntity → CourseDTO
//        mapper.addMappings(new PropertyMap<CourseEntity, CourseDTO>() {
//            @Override
//            protected void configure() {
//                //source là CourseEntity  ,destination là CourseDTO
//                map().setCategoryName(source.getCategory().getName());
//                //Lỗi do trong mapper k cho phép dùng feign client bên trong nó
//                map().setTeacherName(userClient.getUserById(source.getTeacherId()).getData().getUsername());
//                map().setTeacherId(source.getTeacherId());
//                map().setImageUrl(source.getCourseImageEntity().getImageUrl());
//            }
//        });
        return mapper;
    }

    public CourseDTO toCourseDTO(CourseEntity courseEntity) {
        CourseDTO courseDTO = new CourseDTO();
        courseDTO.setId(courseEntity.getId());
        courseDTO.setTitle(courseEntity.getTitle());
        courseDTO.setDescription(courseEntity.getDescription());
        courseDTO.setPrice(courseEntity.getPrice() == null ? null : String.valueOf(courseEntity.getPrice()));
        courseDTO.setLevel(courseEntity.getLevel());
        courseDTO.setQuantity(courseEntity.getQuantity() == null ? null : courseEntity.getQuantity().doubleValue());
        courseDTO.setCreatedAt(courseEntity.getCreatedAt());
        courseDTO.setUpdateAt(courseEntity.getUpdatedAt());

        if (courseEntity.getCategory() != null) {
            courseDTO.setCategoryName(courseEntity.getCategory().getName());
            courseDTO.setCategoryId(courseEntity.getCategory().getId());
        }

        if (courseEntity.getTeacherId() != null) {
            courseDTO.setTeacherName(userClient.getUserById(courseEntity.getTeacherId()).getData().getUsername());
            courseDTO.setTeacherId(courseEntity.getTeacherId());
        }

        if (courseEntity.getCourseImageEntity() != null) {
            courseDTO.setImageUrl(courseEntity.getCourseImageEntity().getImageUrl());
        }

        return courseDTO;
    }

    public LessonDTO toLessonDTO(LessonEntity lessonEntity) {
        return modelMapper().map(lessonEntity, LessonDTO.class);
    }

    public SubLessonDTO toSubLessonDTO(SubLessonEntity subLessonEntity) {
        return modelMapper().map(subLessonEntity, SubLessonDTO.class);
    }


    public CourseDetailDTO toCourseDetailDTO(CoursesDetailEntity coursesDetailEntity) {
        return modelMapper().map(coursesDetailEntity, CourseDetailDTO.class);
    }


    public CommentDTO toCommentDTO(CommentEntity commentEntity) {
        return modelMapper().map(commentEntity, CommentDTO.class);
    }

    public ReviewDTO toReviewDTO(ReviewEntity reviewEntity) {
        return modelMapper().map(reviewEntity, ReviewDTO.class);
    }
}
