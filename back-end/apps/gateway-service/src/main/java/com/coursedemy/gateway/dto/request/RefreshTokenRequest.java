package com.coursedemy.gateway.dto.request;

import com.coursedemy.gateway.constant.AuthValidationMessage;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenRequest {
    @NotBlank(message = AuthValidationMessage.REFRESH_TOKEN_REQUIRED)
    private String refreshToken;
}
