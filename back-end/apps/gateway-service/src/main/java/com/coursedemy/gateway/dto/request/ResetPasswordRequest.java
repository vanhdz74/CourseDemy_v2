package com.coursedemy.gateway.dto.request;

import com.coursedemy.gateway.constant.AuthValidationMessage;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {
    @NotBlank(message = AuthValidationMessage.CURRENT_PASSWORD_REQUIRED)
    private String currentPassword;

    @NotBlank(message = AuthValidationMessage.NEW_PASSWORD_REQUIRED)
    private String newPassword;

    @NotBlank(message = AuthValidationMessage.CONFIRM_PASSWORD_REQUIRED)
    private String confirmPassword;
}
