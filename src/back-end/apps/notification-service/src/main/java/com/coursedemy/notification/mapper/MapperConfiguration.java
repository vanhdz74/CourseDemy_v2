package com.coursedemy.notification.mapper;

import com.coursedemy.notification.dto.*;
import com.coursedemy.notification.entity.*;
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

        return mapper;
    }

    // Các hàm chuyển đổi
    public UserDTO toUserDTO(UserEntity userEntity) {
        return modelMapper().map(userEntity, UserDTO.class);
    }

    public UserProfileUpdateDTO toUserProfileUpdateDTO(UserEntity userEntity) {
        return modelMapper().map(userEntity, UserProfileUpdateDTO.class);
    }
}
