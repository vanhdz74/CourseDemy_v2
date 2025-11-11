package com.vanh.CourseWeb.service;

import com.vanh.CourseWeb.dto.UserDTO;
import com.vanh.CourseWeb.dto.UserProfileUpdateDTO;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();

    UserProfileUpdateDTO getUserById(@PathVariable Long id);

    void updateProfileById(@PathVariable Long id,
                           @RequestBody UserProfileUpdateDTO dto);

    void deleteUserById(@PathVariable Long id);

    String updateAvatar(Long id, MultipartFile file) throws IOException;
}
