package com.coursedemy.gateway.dto.request;

import com.coursedemy.gateway.constant.GatewayValidationMessage;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank(message = GatewayValidationMessage.CURRENT_PASSWORD_REQUIRED)
    private String currentPassword;

    @NotBlank(message = GatewayValidationMessage.NEW_PASSWORD_REQUIRED)
    private String newPassword;

    @NotBlank(message = GatewayValidationMessage.CONFIRM_PASSWORD_REQUIRED)
    private String confirmPassword;
}
