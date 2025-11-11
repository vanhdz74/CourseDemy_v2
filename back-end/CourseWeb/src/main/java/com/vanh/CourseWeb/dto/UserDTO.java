package com.vanh.CourseWeb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.Date;

@Data //toString
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private Long id;

    private String username;

    private String email;

    private String password;

    @JsonProperty("retype_password")
    private String retypePassword;

    @JsonProperty("phone_number")
    private String phoneNumber;

    @JsonProperty("avatar_url")
    private String avatarUrl;

//    private String userDescription;

    @JsonProperty("facebook_link")
    private String facebookLink;

    @JsonProperty("youtube_link")
    private String youtubeLink;

    private int facebookAccountId;

    private int googleAccountId;

    @JsonProperty("is_active")
    private int isActive;

    private String role;
}
