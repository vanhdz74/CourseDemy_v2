package com.coursedemy.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OrderDetailDTO {
    private Long id;

    private Double price;
    
    @JsonProperty(value = "course_id")
    private Long courseId;

    @JsonProperty(value = "order_id")
    private Long orderId;
}
