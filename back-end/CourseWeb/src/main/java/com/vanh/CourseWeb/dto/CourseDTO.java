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
public class CourseDTO {

    private Long id;

    private String title;

    private String description;

    private String price;

    private Integer level;

    private Double quantity;

    @JsonProperty("created_at")
    private Date createdAt;

    @JsonProperty("update_at")
    private Date updateAt;

    @JsonProperty("category_name")
    private String categoryName;

    @JsonProperty("teacher_name")
    private String teacherName;

    @JsonProperty("teacher_id")
    private Long teacherId;
}
