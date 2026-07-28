package com.coursedemy.gateway.controller;

import com.coursedemy.common.dto.response.ApiResponse;
import com.coursedemy.gateway.constant.AuthResponseMessage;
import com.coursedemy.gateway.dto.request.RefreshTokenRequest;
import com.coursedemy.gateway.dto.request.ResetPasswordRequest;
import com.coursedemy.gateway.dto.request.SendOtpRequest;
import com.coursedemy.gateway.dto.request.UserLoginRequest;
import com.coursedemy.gateway.dto.request.UserRegisterRequest;
import com.coursedemy.gateway.dto.request.VerifyOtpRequest;
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

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthTokenResponse>> login(
            @Valid @RequestBody UserLoginRequest request) {

        AuthTokenResponse tokens = authService.login(
                request.getEmail(),
                request.getPassword()
        );

        return ResponseEntity.ok(
                ApiResponse.ok(AuthResponseMessage.LOGIN_SUCCESS, tokens)
        );
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthTokenResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request) {

        AuthTokenResponse tokens = authService.refreshToken(
                request.getRefreshToken()
        );

        return ResponseEntity.ok(
                ApiResponse.ok(AuthResponseMessage.REFRESH_TOKEN_SUCCESS, tokens)
        );
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthTokenResponse>> register(
            @Valid @RequestBody UserRegisterRequest request) {

        AuthTokenResponse tokens = authService.createUser(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.created(
                                AuthResponseMessage.REGISTER_SUCCESS,
                                tokens
                        )
                );
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendOtp(
            @Valid @RequestBody SendOtpRequest request) {

        authService.sendOtpEmail(
                request.getEmail()
        );

        return ResponseEntity.ok(
                ApiResponse.ok(
                        AuthResponseMessage.SEND_OTP_SUCCESS,
                        null
                )
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        authService.verifyOtpAndSendNewPassword(
                request.getEmail(),
                request.getOtp()
        );

        return ResponseEntity.ok(
                ApiResponse.ok(
                        AuthResponseMessage.VERIFY_OTP_SUCCESS,
                        null
                )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request,
            Authentication authentication) {

        UserEntity userEntity =
                (UserEntity) authentication.getPrincipal();

        authService.resetPassword(
                userEntity.getEmail(),
                request.getCurrentPassword(),
                request.getNewPassword(),
                request.getConfirmPassword()
        );

        return ResponseEntity.ok(
                ApiResponse.ok(
                        AuthResponseMessage.RESET_PASSWORD_SUCCESS,
                        null
                )
        );
    }
}
