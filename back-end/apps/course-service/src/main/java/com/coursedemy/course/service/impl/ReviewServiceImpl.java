package com.coursedemy.course.service.impl;

import com.coursedemy.course.mapper.MapperConfiguration;
import com.coursedemy.course.client.UserClient;
import com.coursedemy.course.dto.ReviewDTO;
import com.coursedemy.course.dto.request.UserDTO;
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
    private final UserClient userClient;
    private final CourseRepository courseRepository;
    private final MapperConfiguration mapperConfiguration;

    // LẤY REVIEW THEO COURSE
   @Override
    public List<ReviewDTO> getReviewsByCourseId(
            Long courseId
    ) {

        /**
         * Kiểm tra Course có tồn tại không.
         */
        CourseEntity courseEntity =
                courseRepository.findById(courseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Khoá học không tồn tại"
                                )
                        );

        /**
         * Lấy tất cả Review của Course.
         */
        List<ReviewEntity> reviews =
                reviewRepository.findByCourseEntity_Id(
                        courseId
                );

        List<ReviewDTO> reviewDTOS =
                new ArrayList<>();

        for (ReviewEntity review : reviews) {

            /**
             * Lấy thông tin User từ User-Service
             * thông qua OpenFeign.
             */
            UserDTO userDTO;

            try {

                userDTO =
                        userClient.getUserById(
                                review.getUserId()
                        ).getData();

            } catch (Exception e) {

                throw new RuntimeException(
                        "User không tồn tại với id: "
                                + review.getUserId()
                );
            }

            /**
             * Mapping ReviewEntity -> ReviewDTO.
             */
            ReviewDTO dto =
                    mapperConfiguration.toReviewDTO(
                            review
                    );

            /**
             * Thông tin User.
             */
            dto.setUserName(
                    userDTO.getUsername()
            );

            dto.setUserAvatar(
                    userDTO.getAvatarUrl()
            );

            /**
             * Nếu Review đã bị xóa mềm.
             */
            if (review.getStatus() == 0) {

                dto.setComment(
                        "Review đã bị xoá"
                );

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
    public void createReview(
            ReviewDTO reviewDTO,
            Long userId,
            Long courseId
    ) {

        /**
         * Kiểm tra User tồn tại
         * thông qua User-Service.
         */
        UserDTO userDTO;

        try {

            userDTO =
                    userClient.getUserById(
                            userId
                    ).getData();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Không tồn tại người dùng có id: "
                            + userId
            );
        }

        /**
         * Kiểm tra Course tồn tại.
         */
        CourseEntity courseEntity =
                courseRepository.findById(courseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Không tồn tại khóa học"
                                )
                        );

        /**
         * Tạo Review.
         */
        ReviewEntity reviewEntity =
                new ReviewEntity();

        reviewEntity.setRating(
                reviewDTO.getRating()
        );

        reviewEntity.setComment(
                reviewDTO.getComment()
        );

        reviewEntity.setStatus(1);

        reviewEntity.setParentId(
                reviewDTO.getParentId()
        );

        /**
         * Không còn:
         *
         * reviewEntity.setUserEntity(userEntity);
         *
         * Chỉ lưu userId.
         */
        reviewEntity.setUserId(
                userId
        );

        /**
         * Course cùng Course-Service
         * nên vẫn giữ Entity relationship.
         */
        reviewEntity.setCourseEntity(
                courseEntity
        );

        reviewRepository.save(
                reviewEntity
        );
    }

    // XOÁ REVIEW
    @Override
    public ReviewDTO removeReview(
            Long id,
            Long userId
    ) {

        /**
         * Tìm Review.
         */
        ReviewEntity reviewEntity =
                reviewRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Review không tồn tại"
                                )
                        );

        /**
         * Kiểm tra User có phải người tạo Review không.
         *
         * Không cần UserEntity.
         */
        if (!reviewEntity.getUserId().equals(userId)) {

            throw new RuntimeException(
                    "Bạn không được phép xoá review này"
            );
        }

        /**
         * Xóa mềm.
         */
        reviewEntity.setStatus(0);

        reviewRepository.save(
                reviewEntity
        );

        /**
         * Lấy thông tin User từ User-Service.
         */
        UserDTO userDTO;

        try {

            userDTO =
                    userClient.getUserById(
                            userId
                    ).getData();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Không tìm thấy người dùng có id: "
                            + userId
            );
        }

        /**
         * Mapping Entity -> DTO.
         */
        ReviewDTO dto =
                mapperConfiguration.toReviewDTO(
                        reviewEntity
                );

        dto.setMe(0);

        dto.setComment(
                "Review đã bị xoá"
        );

        dto.setUserName(
                userDTO.getUsername()
        );

        dto.setUserAvatar(
                userDTO.getAvatarUrl()
        );

        return dto;
    }
}
