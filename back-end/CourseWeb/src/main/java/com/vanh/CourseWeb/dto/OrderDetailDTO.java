package com.vanh.CourseWeb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OrderDetailDTO {
    private Long id;

    private Double price;

    @JsonProperty(value = "order_id")
    private Long orderId;
}
