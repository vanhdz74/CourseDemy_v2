package com.vanh.CourseWeb.controller;

import com.vanh.CourseWeb.entity.CartEntity;
import com.vanh.CourseWeb.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    // GET: Xem giỏ hàng của user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getCart(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(cartService.getCart(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // POST: Thêm vào giỏ hàng
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestParam Long userId,
                                       @RequestParam Long courseId) {
        try {
            cartService.addToCart(userId, courseId);
            return ResponseEntity.ok(Map.of("message", "Thêm thành công khoá học vào giỏ hàng!"));
        } catch (IllegalArgumentException e) {
            // Ví dụ user hoặc course không tồn tại
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            // Khóa học đã có trong giỏ hàng
            return ResponseEntity.status(409).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            // Các lỗi khác
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Đã xảy ra lỗi hệ thống: " + e.getMessage()));
        }
    }


    // DELETE: Xoá khỏi giỏ hàng course
    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromCart(
            @RequestParam Long userId,
            @RequestParam Long courseId) {
        try {
            cartService.removeFromCart(userId, courseId);
            return ResponseEntity.ok("Xóa khóa học khỏi giỏ hàng thành công!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

}
