package com.vanh.CourseWeb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserProfileUpdateDTO {
    private String username;
    private String email;

    @JsonProperty("phone_number")
    private String phoneNumber;

    @JsonProperty("avatar_url")
    private String avatarUrl;

    @JsonProperty("facebook_link")
    private String facebookLink;

    @JsonProperty("youtube_link")
    private String youtubeLink;
}

