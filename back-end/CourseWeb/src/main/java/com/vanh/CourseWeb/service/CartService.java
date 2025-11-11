package com.vanh.CourseWeb.service;

import com.vanh.CourseWeb.dto.CartDTO;

public interface CartService {
    void addToCart(Long userId, Long courseId);

    void removeFromCart(Long userId, Long courseId);

    CartDTO getCart(Long userId);
}
