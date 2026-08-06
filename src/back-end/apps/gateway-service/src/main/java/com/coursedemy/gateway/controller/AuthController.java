package com.coursedemy.gateway.controller;

import com.coursedemy.common.constant.CommonResponseMessage;
import com.coursedemy.gateway.dto.request.RefreshTokenRequest;
import com.coursedemy.gateway.dto.request.ResetPasswordRequest;
import com.coursedemy.gateway.dto.request.SendOtpRequest;
import com.coursedemy.gateway.dto.request.UserLoginRequest;
import com.coursedemy.gateway.dto.request.UserRegisterRequest;
import com.coursedemy.gateway.dto.request.VerifyOtpRequest;
import com.coursedemy.gateway.dto.response.ApiResponse;
import com.coursedemy.gateway.dto.response.AuthTokenResponse;
import com.coursedemy.gateway.entity.UserEntity;
import com.coursedemy.gateway.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // Xử lý đăng nhập
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthTokenResponse>> getUserByEmailAndByPassword(
            @Valid @RequestBody UserLoginRequest userLoginRequest) throws Exception {

        AuthTokenResponse tokens = authService.login(
                userLoginRequest.getEmail(),
                userLoginRequest.getPassword()
        );

        return ResponseEntity.ok(
                ApiResponse.ok(CommonResponseMessage.LOGIN_SUCCESS, tokens)
        );
    }

    // Refresh token
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthTokenResponse>> refreshToken(
            @RequestBody RefreshTokenRequest request) throws Exception {

        AuthTokenResponse tokens = authService.refreshToken(
                request.getRefreshToken()
        );

        return ResponseEntity.ok(
                ApiResponse.ok(CommonResponseMessage.REFRESH_TOKEN_SUCCESS, tokens)
        );
    }

    // Xử lý tạo tài khoản
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthTokenResponse>> createUser(
            @Valid @RequestBody UserRegisterRequest request) throws Exception {

        AuthTokenResponse tokens = authService.createUser(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.created(
                                CommonResponseMessage.CREATE_ACCOUNT_SUCCESS,
                                tokens
                        )
                );
    }

    // Gửi otp
    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendOtp(
            @Valid @RequestBody SendOtpRequest request) {

        authService.sendOtpEmail(
                request.getEmail()
        );

        return ResponseEntity.ok(
                ApiResponse.ok(
                        CommonResponseMessage.SEND_OTP_SUCCESS,
                        null
                )
        );
    }

    // Xác nhận otp
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        authService.verifyOtpAndSendNewPassword(
                request.getEmail(),
                request.getOtp()
        );

        return ResponseEntity.ok(
                ApiResponse.ok(
                        CommonResponseMessage.VERIFY_OTP_SUCCESS,
                        null
                )
        );
    }

    // Đổi mật khẩu
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest resetPasswordRequest,
            Authentication authentication) throws Exception {

        UserEntity userEntity =
                (UserEntity) authentication.getPrincipal();

        authService.resetPassword(
                userEntity.getEmail(),
                resetPasswordRequest.getCurrentPassword(),
                resetPasswordRequest.getNewPassword(),
                resetPasswordRequest.getConfirmPassword()
        );

        return ResponseEntity.ok(
                ApiResponse.ok(
                        CommonResponseMessage.RESET_PASSWORD_SUCCESS,
                        null
                )
        );
    }
}
