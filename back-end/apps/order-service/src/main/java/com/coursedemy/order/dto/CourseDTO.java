package com.coursedemy.order.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.Date;

@Data //toString
@Builder
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

    @JsonProperty("course_img")
    private String imageUrl;

    @JsonProperty("category_name")
    private String categoryName;

    @JsonProperty("category_id")
    @JsonAlias("categoryId")
    private Integer categoryId;

    @JsonProperty("teacher_name")
    private String teacherName;

    @JsonProperty("teacher_id")
    private Long teacherId;
}
