package com.coursedemy.order.service;

import com.coursedemy.order.dto.CartDTO;

public interface CartService {
    void addToCart(Long userId, Long courseId);

    void removeFromCart(Long userId, Long courseId);

    CartDTO getCart(Long userId);
}
