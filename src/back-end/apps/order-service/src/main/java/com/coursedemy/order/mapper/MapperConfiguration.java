package com.coursedemy.order.mapper;

import com.coursedemy.order.dto.*;
import com.coursedemy.order.entity.*;
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
        return courseDTO;
    }

    public CartItemDTO toCartItemDTO(CartItemEntity entity) {
        if (entity == null) return null;
        CartItemDTO dto = new CartItemDTO();
        dto.setId(entity.getId());
        if (entity.getCourseEntity() != null) {
            dto.setCourseId(entity.getCourseEntity().getId());
            dto.setPrice(entity.getCourseEntity().getPrice());
        }
        return dto;
    }

    public OrderDTO.TransactionDTO toOrderDTO(OrderEntity orderEntity) {
        return modelMapper().map(orderEntity, OrderDTO.TransactionDTO.class);
    }

    public OrderDetailDTO toOrderDetailDTO(OrderDetailEntity orderDetailEntity) {
        return modelMapper().map(orderDetailEntity, OrderDetailDTO.class);
    }
}
