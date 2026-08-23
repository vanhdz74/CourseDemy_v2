package com.coursedemy.user.dto.request;

import com.coursedemy.user.constant.UserValidationMessage;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginRequest {
    @NotBlank(message = UserValidationMessage.EMAIL_REQUIRED)
    private String email;

    @NotBlank(message = UserValidationMessage.PASSWORD_REQUIRED)
    private String password;
}
