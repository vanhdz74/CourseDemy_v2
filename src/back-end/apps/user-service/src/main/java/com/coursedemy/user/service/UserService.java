package com.coursedemy.user.service;

import com.coursedemy.user.dto.request.UserDTO;
import com.coursedemy.user.dto.request.UserProfileUpdateDTO;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();

    void addUser(UserDTO userDTO);

    UserProfileUpdateDTO getUserById(@PathVariable Long id);

    void updateProfileById(@PathVariable Long id,
                           @RequestBody UserProfileUpdateDTO dto);

    void deleteUserById(@PathVariable Long id);

    String updateAvatar(Long id, MultipartFile file) throws IOException;

    List<UserDTO> getStudentsByCourseId(Long courseId);

    void addStudentToCourseByEmail(Long courseId, String email);

    void removeStudentFromCourse(Long courseId, Long userId);

    String getRoleByUserId(Long userId);

    List<Long> getCourseIdsByUserId(Long userId);
}
