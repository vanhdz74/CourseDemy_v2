package com.coursedemy.notification.dto;

import lombok.Data;

@Data
public class ResetPasswordDTO {
    private String currentPassword;

    private String newPassword;

    private String confirmPassword;
}
