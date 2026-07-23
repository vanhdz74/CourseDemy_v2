package com.coursedemy.gateway.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderDTO {

    @Data
    public static class CheckoutDTO {
        @JsonProperty(value = "user_id")
        private Long userId;

        @JsonProperty(value = "course_id")
        private List<Long> courseIds;

        @JsonProperty(value = "payment_method")
        private String paymentMethod;
    }

    @Data
    public static class TransactionDTO {
        private Long orderId;

        @JsonProperty(value = "total_price")
        private Double totalPrice;

        @JsonProperty(value = "payment_method")
        private String paymentMethod;

        @JsonProperty(value = "payment_time")
        private LocalDateTime paymentTime;

        private String status;

        @JsonProperty(value = "created_at")
        private LocalDateTime createdAt;

        @JsonProperty(value = "user_id")
        private Long userId;

        @JsonProperty(value = "email")
        private String email;

        @JsonProperty(value = "order_details")
        private List<OrderDetailDTO> orderDetailDTOs;
    }
}
