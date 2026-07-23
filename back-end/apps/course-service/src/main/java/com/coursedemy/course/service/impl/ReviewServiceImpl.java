package com.coursedemy.course.service.impl;

import com.coursedemy.course.mapper.MapperConfiguration;
import com.coursedemy.course.dto.ReviewDTO;
import com.coursedemy.course.entity.*;
import com.coursedemy.course.repository.*;
import com.coursedemy.course.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final SubLessonRepository subLessonRepository;
    private final MapperConfiguration mapperConfiguration;

    // LẤY REVIEW THEO COURSE
    @Override
    public List<ReviewDTO> getReviewsByCourseId(Long courseId) {

        CourseEntity courseEntity = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Khoá học không tồn tại"));

        List<ReviewEntity> reviews = reviewRepository.findByCourseEntity_Id(courseId);

        List<ReviewDTO> reviewDTOS = new ArrayList<>();

        for (ReviewEntity review : reviews) {
            Optional<UserEntity> user = userRepository.findById(review.getUserEntity().getId());
            if (user.isEmpty()) {
                throw new RuntimeException("User không tồn tại");
            }

            ReviewDTO dto = mapperConfiguration.toReviewDTO(review);

            dto.setUserName(user.get().getUsername());
            dto.setUserAvatar(user.get().getAvatarUrl());

            // check xem có phải review của mình
//            dto.setMe(user.get().getId().equals(userAuId) ? 1 : 0);

            // nếu bị xóa
            if (review.getStatus() == 0) {
                dto.setComment("Review đã bị xoá");
                dto.setMe(0);
            } else {
                dto.setMe(0);
            }

            reviewDTOS.add(dto);
        }

        return reviewDTOS;
    }

    // TẠO REVIEW
    @Override
    public void createReview(ReviewDTO reviewDTO, Long userId, Long courseId) {

        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tồn tại người dùng"));

        CourseEntity courseEntity = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Không tồn tại khóa học"));

        ReviewEntity reviewEntity = new ReviewEntity();
        reviewEntity.setRating(reviewDTO.getRating());
        reviewEntity.setComment(reviewDTO.getComment());
        reviewEntity.setStatus(1);
        reviewEntity.setParentId(reviewDTO.getParentId());
        reviewEntity.setUserEntity(userEntity);
        reviewEntity.setCourseEntity(courseEntity);

        reviewRepository.save(reviewEntity);
    }

    // XOÁ REVIEW
    @Override
    public ReviewDTO removeReview(Long id, Long userId) {

        ReviewEntity reviewEntity = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review không tồn tại"));

        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // chỉ người tạo review mới được xóa
        if (reviewEntity.getUserEntity().getId().equals(userId)) {
            reviewEntity.setStatus(0);
        } else {
            throw new RuntimeException("Bạn không được phép xoá review này");
        }

        reviewRepository.save(reviewEntity);

        ReviewDTO dto = mapperConfiguration.toReviewDTO(reviewEntity);
        dto.setMe(0);
        dto.setComment("Review đã bị xoá");
        dto.setUserName(userEntity.getUsername());
        dto.setUserAvatar(userEntity.getAvatarUrl());

        return dto;
    }
}
