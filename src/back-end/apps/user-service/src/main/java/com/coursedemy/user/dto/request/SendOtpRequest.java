package com.coursedemy.user.dto.request;

import com.coursedemy.user.constant.UserValidationMessage;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendOtpRequest {
    @NotBlank(message = UserValidationMessage.EMAIL_REQUIRED)
    private String email;
}
