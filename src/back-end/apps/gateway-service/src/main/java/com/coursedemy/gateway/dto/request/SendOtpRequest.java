package com.coursedemy.gateway.dto.request;

import com.coursedemy.gateway.constant.GatewayValidationMessage;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendOtpRequest {
    @NotBlank(message = GatewayValidationMessage.EMAIL_REQUIRED)
    private String email;
}
