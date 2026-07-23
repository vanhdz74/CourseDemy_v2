package com.coursedemy.order.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class OtpDTO {
    private String email;
    private String otp;
}
