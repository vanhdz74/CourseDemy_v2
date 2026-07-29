package com.coursedemy.user.controller;


import com.coursedemy.user.dto.request.UserDTO;
import com.coursedemy.user.dto.request.UserProfileUpdateDTO;
import com.coursedemy.user.dto.response.ApiResponse;
import com.coursedemy.user.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    //
    @GetMapping("/")
    public ResponseEntity<ApiResponse<String>> hello() {
        return ResponseEntity.ok(ApiResponse.ok("hello"));
    }

    // GET: lấy toàn bộ users
    @GetMapping("/user/all")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok(userService.getAllUsers()));
    }

    // POST: thêm user mới
    @PostMapping("/user")
    public ResponseEntity<ApiResponse<Void>> addUser(@RequestBody UserDTO userDTO) {
        userService.addUser(userDTO);
        return ResponseEntity.ok(ApiResponse.ok("Thêm người dùng mới thành công", null));
    }

    // GET
    @GetMapping("/user/{id}")
    public ResponseEntity<ApiResponse<UserProfileUpdateDTO>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getUserById(id)));
    }

    // PUT: Update profile theo id
    @PutMapping("/user/update/{id}")
    public ResponseEntity<ApiResponse<Void>> updateProfile(@PathVariable Long id, @RequestBody UserProfileUpdateDTO dto) {
        userService.updateProfileById(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật hồ sơ thành công", null));
    }

    // DELETE: Xoá user theo id
    @DeleteMapping("/user/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok(ApiResponse.ok("Xoá người dùng có id = " + id + "thành công", null));
    }

    // POST: Cập nhật upload ảnh ngừoi dùng
    @PostMapping("/user/upload-avatar/{id}")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadAvatar(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) throws Exception {
        String newUrl = userService.updateAvatar(id, file);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("url", newUrl)));
    }

    // GET: Lấy các học viên theo khoá học
    @GetMapping("/user/course/{courseId}")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getStudentsByCourseId(@PathVariable Long courseId) {
        List<UserDTO> students = userService.getStudentsByCourseId(courseId);
        return ResponseEntity.ok(ApiResponse.ok(students));
    }

    // POST: Thêm 1 student vào 1 khoá học bằng email
    @PostMapping("/courses/{courseId}/students")
    public ResponseEntity<ApiResponse<Void>> addStudentToCourseByEmail(
            @PathVariable Long courseId,
            @RequestBody Map<String, String> request
    ) {
        String email = request.get("email");
        userService.addStudentToCourseByEmail(courseId, email);
        return ResponseEntity.ok(ApiResponse.ok("Thêm học viên vào khoá học thành công", null));
    }

    @DeleteMapping("/courses/{courseId}/students/{userId}")
    public ResponseEntity<ApiResponse<Void>> removeStudentFromCourse(
            @PathVariable Long courseId,
            @PathVariable Long userId
    ) {
        userService.removeStudentFromCourse(courseId, userId);
        return ResponseEntity.ok(ApiResponse.ok("Xoá người dùng khỏi khoá học thành công", null));
    }

    @GetMapping("/user/internal/users/{id}/role")
    public ResponseEntity<ApiResponse<String>> getRoleByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getRoleByUserId(id)));
    }

    @GetMapping("/user/internal/users/{id}/course-ids")
    public ResponseEntity<ApiResponse<List<Long>>> getCourseIdsByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getCourseIdsByUserId(id)));
    }
}
