package com.coursedemy.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Date;

@Data
public class CommentDTO {

    private Long id;

    private String comment;

    private Integer status;

    @JsonProperty(value = "parent_id")
    private Long parentId;

    @JsonProperty(value = "create_at")
    private Date createdAt;

    @JsonProperty(value = "update_at")
    private Date updatedAt;

    @JsonProperty(value = "user_id")
    private Long userId;

    @JsonProperty(value = "user_name")
    private String userName;

    @JsonProperty(value = "user_avatar")
    private String userAvatar;

    @JsonProperty(value = "sublesson_id")
    private Long subLessonId;

    @JsonProperty(value = "me")
    private Integer me;
}
