package com.vanh.CourseWeb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data //toString
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SubLessonDTO {
    private Long id;

    private String title;

    @JsonProperty("video_url")
    private String videoUrl;

    @JsonProperty("duration")
    private Long duration;

    @JsonProperty("order_index")
    private Long orderIndex;
}
