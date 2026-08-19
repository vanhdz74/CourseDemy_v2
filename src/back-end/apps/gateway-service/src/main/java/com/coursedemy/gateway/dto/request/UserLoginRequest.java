package com.coursedemy.gateway.dto.request;

import com.coursedemy.gateway.constant.GatewayValidationMessage;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginRequest {
    @NotBlank(message = GatewayValidationMessage.EMAIL_REQUIRED)
    private String email;

    @NotBlank(message = GatewayValidationMessage.PASSWORD_REQUIRED)
    private String password;
}
