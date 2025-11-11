package com.vanh.CourseWeb.service;

import com.vanh.CourseWeb.dto.UserDTO;
import com.vanh.CourseWeb.entity.UserEntity;

public interface AuthService {
    String login(String email, String password) throws Exception;
    UserEntity createUser(UserDTO userDTO) throws Exception;
}
