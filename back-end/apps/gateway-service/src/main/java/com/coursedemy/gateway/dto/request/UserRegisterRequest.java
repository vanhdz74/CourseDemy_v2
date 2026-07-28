package com.coursedemy.gateway.dto.request;

import com.coursedemy.gateway.constant.AuthValidationMessage;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterRequest {
    @NotBlank(message = AuthValidationMessage.USERNAME_REQUIRED)
    private String username;

    @NotBlank(message = AuthValidationMessage.EMAIL_REQUIRED)
    @Email(message = AuthValidationMessage.EMAIL_INVALID)
    private String email;

    @NotBlank(message = AuthValidationMessage.PASSWORD_REQUIRED)
    private String password;

    @NotBlank(message = AuthValidationMessage.RETYPE_PASSWORD_REQUIRED)
    @JsonProperty("retype_password")
    private String retypePassword;

    @NotBlank(message = AuthValidationMessage.PHONE_NUMBER_REQUIRED)
    @JsonProperty("phone_number")
    private String phoneNumber;

    @JsonProperty("avatar_url")
    private String avatarUrl;

    @JsonProperty("facebook_link")
    private String facebookLink;

    @JsonProperty("youtube_link")
    private String youtubeLink;

    private int facebookAccountId;

    private int googleAccountId;

    @NotBlank(message = AuthValidationMessage.ROLE_REQUIRED)
    private String role;
}
