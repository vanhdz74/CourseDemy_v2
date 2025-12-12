package com.vanh.CourseWeb.controller;

import com.vanh.CourseWeb.dto.UserDTO;
import com.vanh.CourseWeb.dto.UserLoginDTO;
import com.vanh.CourseWeb.entity.UserEntity;
import com.vanh.CourseWeb.service.AuthService;
import com.vanh.CourseWeb.utils.RSAEncrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}")
public class AuthController {

    @Autowired
    AuthService authService;

    @Autowired
    RSAEncrypt rsa;

    // Xử lý đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> getUserByEmailAndByPassword(
            @Valid @RequestBody UserLoginDTO userLoginDTO) {
        // Kiểm tra thông tin đăng nhập và sinh token
        try {
            String token = authService.login(userLoginDTO.getEmail(), userLoginDTO.getPassword());
            // Trả về token trong response
            // Trả JSON dạng { "token": "..." }
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xử lý tạo tài khoản
    @PostMapping("/register")
    // Kiểm tra xem có đầy đủ các filed yêu cầu hay ko
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDTO userDTO,
                                        BindingResult result) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }

            // Xem nó có trùng 2 mk
            if (!userDTO.getPassword().equals(userDTO.getRetypePassword())) {
                return ResponseEntity.badRequest().body("Password not match");
            }

            UserEntity userEntity = authService.createUser(userDTO); // return ResponseEntity.ok("Register successfully");
            return ResponseEntity.ok("");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage()); // rule 5
        }
    }

    @GetMapping("/public-key")
    public Map<String, String> getPublicKey() {
        String key = rsa.publicKeyToBase64(rsa.getPublicKey());
        return Map.of("publicKey", key);
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody UserLoginDTO userLoginDTO) {
        authService.sendOtpEmail(userLoginDTO.getEmail());
        return ResponseEntity.ok(Map.of("message", "OTP đã được gửi"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpDTO req) {
        try {
            authService.verifyOtpAndSendNewPassword(req.getEmail(), req.getOtp());
            return ResponseEntity.ok(Map.of("message", "OTP đúng. Mật khẩu mới đã được gửi về email"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody UserDTO userDTO,
            Authentication authentication) {
        try {
            UserEntity userEntity = (UserEntity) authentication.getPrincipal();
            authService.resetPassword(userEntity.getEmail(), userDTO.getPassword(), userDTO.getRetypePassword());
            return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}