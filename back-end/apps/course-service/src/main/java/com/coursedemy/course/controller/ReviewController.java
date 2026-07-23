package com.coursedemy.course.controller;

import com.coursedemy.course.dto.ReviewDTO;
import com.coursedemy.common.dto.response.ApiResponse;
import com.coursedemy.course.entity.UserEntity;
import com.coursedemy.course.service.ReviewService;
//import com.coursedemy.course.service.ReviewLikeService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReviewsByCourseId(
            @PathVariable Long course_id
    ) {
        List<ReviewDTO> reviews = reviewService.getReviewsByCourseId(course_id);
        Double rating = reviews.isEmpty()
                ? 0.0
                : reviews.stream().mapToDouble(ReviewDTO::getRating).sum() / reviews.size();

        Map<String, Object> response = new HashMap<>();
        response.put("ranting", rating); // hoặc bất cứ giá trị nào bạn muốn
        response.put("reviews", reviews);

        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    // TẠO REVIEW
    @PostMapping("/review/course/{id}")
    public ResponseEntity<ApiResponse<Void>> createReview(
            @RequestBody ReviewDTO reviewDTO,
            @PathVariable Long id,
            Authentication authentication
    ) {
        UserEntity userEntity = (UserEntity) authentication.getPrincipal();
        Long userId = userEntity.getId();
        reviewService.createReview(reviewDTO, userId, id);
        return ResponseEntity.ok(ApiResponse.ok("Đánh giá của bạn đã được đăng", null));
    }

    // ================= XÓA REVIEW ================= //
    @DeleteMapping("/review/{id}")
    public ResponseEntity<ApiResponse<ReviewDTO>> removeReview(
            @PathVariable Long id,
            Authentication authentication
    ) {
        UserEntity userEntity = (UserEntity) authentication.getPrincipal();
        Long userId = userEntity.getId();
        ReviewDTO deletedReview = reviewService.removeReview(id, userId);
        return ResponseEntity.ok(ApiResponse.ok(deletedReview));
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
