package com.coursedemy.payment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.Date;

@Data //toString
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {
    private Long id;

    private Double rating;

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

    @JsonProperty(value = "course_id")
    private Long courseId;

    @JsonProperty(value = "me")
    private Integer me;
}
