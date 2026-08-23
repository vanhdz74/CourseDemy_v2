package com.coursedemy.user.dto.request;

import com.coursedemy.user.constant.UserValidationMessage;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VerifyOtpRequest {
    @NotBlank(message = UserValidationMessage.EMAIL_REQUIRED)
    private String email;

    @NotBlank(message = UserValidationMessage.OTP_REQUIRED)
    private String otp;
}
