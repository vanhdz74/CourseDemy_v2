package com.vanh.CourseWeb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Data //toString
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LessonDTO {
    private Long id;

    private String title;

    @JsonProperty("order_index")
    private Long orderIndex;
}
