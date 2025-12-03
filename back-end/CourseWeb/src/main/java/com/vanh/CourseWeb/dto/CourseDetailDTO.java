package com.vanh.CourseWeb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data //toString
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CourseDetailDTO {
    CourseDTO course;

    private Long id;

    private String content;

    @JsonProperty("course_include")
    private String courseInclude;

    private String request;

    private String description;
}
