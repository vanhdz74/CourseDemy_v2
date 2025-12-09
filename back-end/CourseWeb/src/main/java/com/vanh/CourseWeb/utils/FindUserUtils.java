package com.vanh.CourseWeb.utils;

import com.vanh.CourseWeb.entity.UserEntity;
import com.vanh.CourseWeb.repository.UserRepository;

public class FindUserUtils {

    public static UserEntity getUserByEmailOrThrow(UserRepository userRepository, String email) {
        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Email không tồn tại");
        }
        return user;
    }

    public static UserEntity getUserByIdOrThrow(UserRepository userRepository, Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
    }
}
