package com.coursedemy.gateway.mapper;

import com.coursedemy.gateway.dto.*;
import com.coursedemy.gateway.entity.*;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfiguration {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();

        // Giới hạn chỉ map các field cần thiết
        mapper.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setSkipNullEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        // Cấu hình map riêng cho UserEntity → UserDTO
        mapper.addMappings(new PropertyMap<UserEntity, UserDTO>() {
            @Override
            protected void configure() {
                // Map roleEntity.roleName → role
                map().setRole(source.getRoleEntity().getRoleName());

                // Không map password ra DTO
                skip(destination.getPassword());

                // Không map retypePassword (để tránh NullPointerException)
                skip(destination.getRetypePassword());
            }
        });

        // Cấu hình map riêng cho CourseEntity → CourseDTO
        mapper.addMappings(new PropertyMap<CourseEntity, CourseDTO>() {
            @Override
            protected void configure() {
                //  →
                map().setCategoryName(source.getCategory().getName());
                map().setTeacherName(source.getUser().getUsername());
                map().setTeacherId(source.getUser().getId());
                map().setImageUrl(source.getCourseImageEntity().getImageUrl());
            }
        });

        // Map CartItemEntity → CartItemDTO
        mapper.addMappings(new PropertyMap<CartItemEntity, CartItemDTO>() {
            @Override
            protected void configure() {
                map().setCourseId(source.getCourseEntity().getId());
                map().setPrice(source.getCourseEntity().getPrice());
            }
        });
        return mapper;
    }

    // Các hàm chuyển đổi
    public UserDTO toUserDTO(UserEntity userEntity) {
        return modelMapper().map(userEntity, UserDTO.class);
    }

    public UserProfileUpdateDTO toUserProfileUpdateDTO(UserEntity userEntity) {
        return modelMapper().map(userEntity, UserProfileUpdateDTO.class);
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
        courseDTO.setUpdateAt(courseEntity.getUpdateAt());

        if (courseEntity.getCategory() != null) {
            courseDTO.setCategoryName(courseEntity.getCategory().getName());
            courseDTO.setCategoryId(courseEntity.getCategory().getId());
        }

        if (courseEntity.getUser() != null) {
            courseDTO.setTeacherName(courseEntity.getUser().getUsername());
            courseDTO.setTeacherId(courseEntity.getUser().getId());
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

    public CartItemDTO toCartItemDTO(CartItemEntity entity) {
        return modelMapper().map(entity, CartItemDTO.class);
    }

    public CourseDetailDTO toCourseDetailDTO(CoursesDetailEntity coursesDetailEntity) {
        return modelMapper().map(coursesDetailEntity, CourseDetailDTO.class);
    }

    public OrderDTO.TransactionDTO toOrderDTO(OrderEntity orderEntity) {
        return modelMapper().map(orderEntity, OrderDTO.TransactionDTO.class);
    }

    public OrderDetailDTO toOrderDetailDTO(OrderDetailEntity orderDetailEntity) {
        return modelMapper().map(orderDetailEntity, OrderDetailDTO.class);
    }

    public CommentDTO toCommentDTO(CommentEntity commentEntity) {
        return modelMapper().map(commentEntity, CommentDTO.class);
    }

    public ReviewDTO toReviewDTO(ReviewEntity reviewEntity) {
        return modelMapper().map(reviewEntity, ReviewDTO.class);
    }
}
