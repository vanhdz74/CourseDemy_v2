package com.coursedemy.gateway.dto.request;

import com.coursedemy.gateway.constant.AuthValidationMessage;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendOtpRequest {
    @NotBlank(message = AuthValidationMessage.EMAIL_REQUIRED)
    @Email(message = AuthValidationMessage.EMAIL_INVALID)
    private String email;
}
