package com.coursedemy.gateway.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RefreshTokenRequest {
    @JsonProperty("refreshToken")
    private String refreshToken;
}
