package com.vanh.CourseWeb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Data
@Builder
public class OrderDTO {

    @Data
    public static class CheckoutCartDTO {
        @JsonProperty(value = "user_id")
        private Long userId;

        @JsonProperty(value = "course_id")
        private List<Long> courseIds;

        @JsonProperty(value = "payment_method")
        private String paymentMethod;
    }

    @Data
    public static class CheckoutDirectDTO {
        private Long userId;
        private Long courseId;
        private String paymentMethod;
    }
}
