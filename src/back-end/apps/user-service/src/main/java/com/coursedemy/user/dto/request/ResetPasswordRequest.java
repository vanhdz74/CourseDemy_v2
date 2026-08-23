package com.coursedemy.user.dto.request;

import com.coursedemy.user.constant.UserValidationMessage;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordRequest {
    @NotBlank(message = UserValidationMessage.CURRENT_PASSWORD_REQUIRED)
    @JsonProperty("current_password")
    private String currentPassword;

    @NotBlank(message = UserValidationMessage.NEW_PASSWORD_REQUIRED)
    @JsonProperty("new_password")
    private String newPassword;

    @NotBlank(message = UserValidationMessage.CONFIRM_PASSWORD_REQUIRED)
    @JsonProperty("confirm_password")
    private String confirmPassword;
}
