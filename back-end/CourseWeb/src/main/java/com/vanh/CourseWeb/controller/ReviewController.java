package com.vanh.CourseWeb.controller;

import com.vanh.CourseWeb.dto.ReviewDTO;
import com.vanh.CourseWeb.entity.UserEntity;
import com.vanh.CourseWeb.service.ReviewService;
//import com.vanh.CourseWeb.service.ReviewLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
//    private final ReviewLikeService reviewLikeService;

    // GET: LẤY REVIEW THEO KHÓA HỌC
    @GetMapping("/reviews/course/{course_id}")
    public Map<String, Object> getReviewsByCourseId(
            @PathVariable Long course_id
    ) {
        List<ReviewDTO> reviews = reviewService.getReviewsByCourseId(course_id);
        Double rating = reviews.stream().mapToDouble(ReviewDTO::getRating).sum() / reviews.size();

        Map<String, Object> response = new HashMap<>();
        response.put("ranting", rating); // hoặc bất cứ giá trị nào bạn muốn
        response.put("reviews", reviews);

        return response;
    }

    // TẠO REVIEW
    @PostMapping("/review/course/{id}")
    public ResponseEntity<?> createReview(
            @RequestBody ReviewDTO reviewDTO,
            @PathVariable Long id,
            Authentication authentication
    ) {
        try {
            UserEntity userEntity = (UserEntity) authentication.getPrincipal();
            Long userId = userEntity.getId();

            reviewService.createReview(reviewDTO, userId, id);
            return ResponseEntity.ok(Map.of("message", "Đánh giá của bạn đã được đăng"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ================= XÓA REVIEW ================= //
    @DeleteMapping("/review/{id}")
    public ResponseEntity<?> removeReview(
            @PathVariable Long id,
            Authentication authentication
    ) {
        try {
            UserEntity userEntity = (UserEntity) authentication.getPrincipal();
            Long userId = userEntity.getId();

            ReviewDTO deletedReview = reviewService.removeReview(id, userId);
            return ResponseEntity.ok(deletedReview);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

//    // ================= LIKE REVIEW ================= //
//    @PostMapping("/review/{review_id}/like")
//    public ResponseEntity<?> likeReview(
//            @PathVariable Long review_id,
//            Authentication authentication
//    ) {
//        try {
//            UserEntity userEntity = (UserEntity) authentication.getPrincipal();
//            Long userId = userEntity.getId();
//
//            ReviewDTO review = reviewLikeService.likeReview(review_id, userId);
//            return ResponseEntity.ok(review);
//
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("error", e.getMessage()));
//        }
//    }
//
//    // ================= DISLIKE REVIEW ================= //
//    @PostMapping("/review/{review_id}/dislike")
//    public ResponseEntity<?> dislikeReview(
//            @PathVariable Long review_id,
//            Authentication authentication
//    ) {
//        try {
//            UserEntity userEntity = (UserEntity) authentication.getPrincipal();
//            Long userId = userEntity.getId();
//
//            ReviewDTO review = reviewLikeService.dislikeReview(review_id, userId);
//            return ResponseEntity.ok(review);
//
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("error", e.getMessage()));
//        }
//    }
}
