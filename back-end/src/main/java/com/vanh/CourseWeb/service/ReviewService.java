package com.vanh.CourseWeb.service;

import com.vanh.CourseWeb.dto.ReviewDTO;

import java.util.List;

public interface ReviewService {
    List<ReviewDTO> getReviewsByCourseId(Long courseId);

    void createReview(ReviewDTO reviewDTO, Long userId, Long courseId);

    ReviewDTO removeReview(Long id, Long userId);
}
