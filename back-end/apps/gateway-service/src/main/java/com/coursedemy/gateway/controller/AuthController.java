package com.coursedemy.gateway.controller;

import com.coursedemy.gateway.dto.OtpDTO;
import com.coursedemy.gateway.dto.ResetPasswordDTO;
import com.coursedemy.gateway.dto.UserDTO;
import com.coursedemy.gateway.dto.UserLoginDTO;
import com.coursedemy.common.dto.response.ApiResponse;
import com.coursedemy.gateway.dto.response.AuthTokenResponse;
import com.coursedemy.gateway.entity.UserEntity;
import com.coursedemy.common.exception.BusinessException;
import com.coursedemy.common.exception.ErrorCode;
import com.coursedemy.gateway.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("${api.prefix}")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    // Xử lý đăng nhập
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthTokenResponse>> getUserByEmailAndByPassword(
            @Valid @RequestBody UserLoginDTO userLoginDTO) throws Exception {
        AuthTokenResponse tokens = authService.login(userLoginDTO.getEmail(), userLoginDTO.getPassword());
        return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công", tokens));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthTokenResponse>> refreshToken(@RequestBody Map<String, String> request) throws Exception {
        AuthTokenResponse tokens = authService.refreshToken(request.get("refreshToken"));
        return ResponseEntity.ok(ApiResponse.ok("Refresh token thành công", tokens));
    }

    // Xử lý tạo tài khoản
    @PostMapping("/register")
    // Kiểm tra xem có đầy đủ các filed yêu cầu hay ko
    public ResponseEntity<ApiResponse<AuthTokenResponse>> createUser(@Valid @RequestBody UserDTO userDTO) throws Exception {
        // Xem nó có trùng 2 mk
        if (!userDTO.getPassword().equals(userDTO.getRetypePassword())) {
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }

        AuthTokenResponse tokens = authService.createUser(userDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Tạo tài khoản thành công", tokens));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@RequestBody UserLoginDTO userLoginDTO) {
        authService.sendOtpEmail(userLoginDTO.getEmail());
        return ResponseEntity.ok(ApiResponse.ok("OTP đã được gửi", null));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@RequestBody OtpDTO req) {
        authService.verifyOtpAndSendNewPassword(req.getEmail(), req.getOtp());
        return ResponseEntity.ok(ApiResponse.ok("OTP đúng. Mật khẩu mới đã được gửi về email", null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @RequestBody ResetPasswordDTO resetPasswordDTO,
            Authentication authentication) throws Exception {
        UserEntity userEntity = (UserEntity) authentication.getPrincipal();
        authService.resetPassword(
                userEntity.getEmail(),
                resetPasswordDTO.getCurrentPassword(),
                resetPasswordDTO.getNewPassword(),
                resetPasswordDTO.getConfirmPassword());
        return ResponseEntity.ok(ApiResponse.ok("Đổi mật khẩu thành công", null));
    }
}
