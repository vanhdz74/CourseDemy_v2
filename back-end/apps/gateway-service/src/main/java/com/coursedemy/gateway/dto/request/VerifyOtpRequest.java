package com.coursedemy.gateway.dto.request;

import com.coursedemy.gateway.constant.GatewayValidationMessage;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyOtpRequest {
    @NotBlank(message = GatewayValidationMessage.EMAIL_REQUIRED)
    private String email;

    @NotBlank(message = GatewayValidationMessage.OTP_REQUIRED)
    private String otp;
}
