package com.vanh.CourseWeb.controller;

import com.vanh.CourseWeb.dto.CartDTO;
import com.vanh.CourseWeb.dto.response.ApiResponse;
import com.vanh.CourseWeb.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    // GET: Xem giỏ hàng của user
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<CartDTO>> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(cartService.getCart(userId)));
    }

    // POST: Thêm vào giỏ hàng
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Void>> addToCart(@RequestParam Long userId,
                                                       @RequestParam Long courseId) {
        cartService.addToCart(userId, courseId);
        return ResponseEntity.ok(ApiResponse.ok("Thêm thành công khoá học vào giỏ hàng!", null));
    }


    // DELETE: Xoá khỏi giỏ hàng course
    @DeleteMapping("/remove")
    public ResponseEntity<ApiResponse<Void>> removeFromCart(
            @RequestParam Long userId,
            @RequestParam Long courseId) {
        cartService.removeFromCart(userId, courseId);
        return ResponseEntity.ok(ApiResponse.ok("Xóa khóa học khỏi giỏ hàng thành công!", null));
    }

}
