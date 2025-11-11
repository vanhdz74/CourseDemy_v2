package com.vanh.CourseWeb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.vanh.CourseWeb.entity.CartItemEntity;
import lombok.*;

import java.util.List;

@Data //toString
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CartDTO {
    @JsonProperty(value = "cart_id")
    private Long id;

    @JsonProperty(value = "cart_items")
    private List<CartItemDTO> cartItems;
}
