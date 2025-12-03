package com.vanh.CourseWeb.controller;


import com.vanh.CourseWeb.service.CloudinaryService;
import com.vanh.CourseWeb.dto.UserDTO;
import com.vanh.CourseWeb.dto.UserProfileUpdateDTO;
import com.vanh.CourseWeb.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET: lấy toàn bộ users
    @GetMapping("/user/all")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // POST: thêm user mới
    @PostMapping("/user")
    public ResponseEntity<?> addUser(@RequestBody UserDTO userDTO) {
        try {
            userService.addUser(userDTO);
            return ResponseEntity.ok(Map.of("message", "Thêm người dùng mới thành công"));
        } catch (Exception e) {
            // Các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // GET
    @GetMapping("/user/{id}")
    public UserProfileUpdateDTO getUserById(@PathVariable Long id) {
        UserProfileUpdateDTO result = userService.getUserById(id);
        return result;
    }

    // PUT: Update profile theo id
    @PutMapping("/user/update/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody UserProfileUpdateDTO dto) {
        userService.updateProfileById(id, dto);
        return ResponseEntity.ok(Map.of("message", "Cập nhật hồ sơ thành công"));
    }

    // DELETE: Xoá user theo id
    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUserById(id);
            return ResponseEntity.ok(Map.of("message", "Xoá người dùng có id = " + id + "thành công"));
        } catch (Exception e) {
            // Các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // POST: Cập nhật upload ảnh ngừoi dùng
    @PostMapping("/user/upload-avatar/{id}")
    public ResponseEntity<?> uploadAvatar(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            String newUrl = userService.updateAvatar(id, file);
            return ResponseEntity.ok(Map.of("url", newUrl));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload thất bại: " + e.getMessage());
        }
    }

    // GET: Lấy các học viên theo khoá học
    @GetMapping("/users/course/{courseId}")
    public ResponseEntity<?> getStudentsByCourseId(@PathVariable Long courseId) {
        try {
            List<UserDTO> students = userService.getStudentsByCourseId(courseId);
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // POST: Thêm 1 student vào 1 khoá học bằng email
    @PostMapping("/courses/{courseId}/students")
    public ResponseEntity<?> addStudentToCourseByEmail(
            @PathVariable Long courseId,
            @RequestBody Map<String, String> request
    ) {
        try {
            String email = request.get("email");
            userService.addStudentToCourseByEmail(courseId, email);
            return ResponseEntity.ok(Map.of("message", "Thêm học viên vào khoá học thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/courses/{courseId}/students/{userId}")
    public ResponseEntity<?> removeStudentFromCourse(
            @PathVariable Long courseId,
            @PathVariable Long userId
    ) {
        try {
            userService.removeStudentFromCourse(courseId, userId);
            return ResponseEntity.ok(Map.of("message", "Xoá người dùng khỏi khoá học thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

}


