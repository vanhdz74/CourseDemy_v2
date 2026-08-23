package com.coursedemy.user.controller;

import com.coursedemy.user.constant.CommonResponseMessage;
import com.coursedemy.user.dto.request.RefreshTokenRequest;
import com.coursedemy.user.dto.request.ResetPasswordRequest;
import com.coursedemy.user.dto.request.SendOtpRequest;
import com.coursedemy.user.dto.request.UserLoginRequest;
import com.coursedemy.user.dto.request.UserRegisterRequest;
import com.coursedemy.user.dto.request.VerifyOtpRequest;
import com.coursedemy.user.dto.response.ApiResponse;
import com.coursedemy.user.dto.response.AuthTokenResponse;
import com.coursedemy.user.exception.BusinessException;
import com.coursedemy.user.exception.ErrorCode;
import com.coursedemy.user.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthTokenResponse>> login(
            @Valid @RequestBody UserLoginRequest userLoginRequest) throws Exception {

        AuthTokenResponse tokens = authService.login(
                userLoginRequest.getEmail(),
                userLoginRequest.getPassword()
        );

        return ResponseEntity.ok(
                ApiResponse.ok(CommonResponseMessage.LOGIN_SUCCESS, tokens)
        );
    }

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

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendOtp(
            @Valid @RequestBody SendOtpRequest request) {

        authService.sendOtpEmail(request.getEmail());

        return ResponseEntity.ok(
                ApiResponse.ok(
                        CommonResponseMessage.SEND_OTP_SUCCESS,
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
                        CommonResponseMessage.VERIFY_OTP_SUCCESS,
                        null
                )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest resetPasswordRequest,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail
    ) throws Exception {

        if (userEmail == null || userEmail.isBlank()) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        authService.resetPassword(
                userEmail,
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
