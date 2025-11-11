package com.vanh.CourseWeb.controller;


import com.vanh.CourseWeb.service.CloudinaryService;
import com.vanh.CourseWeb.dto.UserDTO;
import com.vanh.CourseWeb.dto.UserProfileUpdateDTO;
import com.vanh.CourseWeb.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET: /users
    @GetMapping("/all")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // GET
    @GetMapping("/{id}")
    public UserProfileUpdateDTO getUserById(@PathVariable Long id) {
        UserProfileUpdateDTO result = userService.getUserById(id);
        return result;
    }

    // PUT: Update profile theo id
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody UserProfileUpdateDTO dto) {
        userService.updateProfileById(id, dto);
        return ResponseEntity.ok(Map.of("message", "Cập nhật hồ sơ thành công"));
    }

    // POST: Cập nhật upload ảnh ngừoi dùng
    @PostMapping("/upload-avatar/{id}")
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
}
