package com.coursedemy.gateway.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterRequest {
    private String username;

    private String email;

    private String password;

    @JsonProperty("retype_password")
    private String retypePassword;

    @JsonProperty("phone_number")
    private String phoneNumber;

    @JsonProperty("avatar_url")
    private String avatarUrl;

    @JsonProperty("facebook_account_id")
    @JsonAlias("facebookAccountId")
    private int facebookAccountId;

    @JsonProperty("google_account_id")
    @JsonAlias("googleAccountId")
    private int googleAccountId;

    private String role;
}
