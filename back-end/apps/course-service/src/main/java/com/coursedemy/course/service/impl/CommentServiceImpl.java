package com.coursedemy.course.service.impl;

import com.coursedemy.course.mapper.MapperConfiguration;
import com.coursedemy.course.client.UserClient;
import com.coursedemy.course.dto.CommentDTO;
import com.coursedemy.course.dto.request.UserDTO;
import com.coursedemy.course.entity.*;
import com.coursedemy.course.repository.*;
import com.coursedemy.course.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final SubLessonRepository subLessonRepository;
    private final CommentRepository commentRepository;
    private final MapperConfiguration mapperConfiguration;
    private final UserClient userClient;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    @Override
    public List<CommentDTO> getCommentsBySublessonId(
            Long sublessonId,
            Long userAuId
    ) {

        // Kiểm tra SubLesson có tồn tại không
        SubLessonEntity subLessonEntity =
                subLessonRepository.findById(sublessonId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Không tồn tại bài học này có id: "
                                                + sublessonId
                                )
                        );

        List<CommentDTO> commentDTOS = new ArrayList<>();

        List<CommentEntity> commentEntities =
                commentRepository.findAllBySubLessonEntity_Id(
                        sublessonId
                );

        for (CommentEntity comment : commentEntities) {

            /**
             * Lấy User từ User-Service thông qua OpenFeign.
             */
            UserDTO userDTO;

            try {

                userDTO = userClient.getUserById(
                        comment.getUserId()
                ).getData();

            } catch (Exception e) {

                throw new RuntimeException(
                        "User không tồn tại với id: "
                                + comment.getUserId()
                );
            }

            CommentDTO commentDTO =
                    mapperConfiguration.toCommentDTO(comment);

            /**
             * Kiểm tra comment có phải của user hiện tại không.
             */
            if (userDTO.getId().equals(userAuId)) {
                commentDTO.setMe(1);
            } else {
                commentDTO.setMe(0);
            }

            /**
             * Nếu comment đã bị xóa mềm.
             */
            if (comment.getStatus() == 0) {

                commentDTO.setComment(
                        "Tin nhắn đã bị xoá"
                );

                commentDTO.setMe(0);

            } else {

                commentDTO.setComment(
                        comment.getComment()
                );
            }

            /**
             * Thông tin User lấy từ User-Service.
             */
            commentDTO.setUserName(
                    userDTO.getUsername()
            );

            commentDTO.setUserAvatar(
                    userDTO.getAvatarUrl()
            );

            commentDTOS.add(commentDTO);
        }

        return commentDTOS;
    }

    @Override
    public List<CommentDTO> getCommentsByCourseId(Long courseId) {
        CourseEntity courseEntity = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Khoá học không tồn tại"));

        List<LessonEntity> lessonEntities = lessonRepository.findAllByCourseEntity_Id(courseId);
        if (lessonEntities.isEmpty()) return new ArrayList<>();

        // 1. Lấy tất cả sublesson thuộc các lesson
        List<Long> lessonIds = lessonEntities.stream()
                .map(LessonEntity::getId)
                .toList();
        List<SubLessonEntity> subLessons = subLessonRepository.findByLesson_IdIn(lessonIds);
        if (subLessons.isEmpty()) return new ArrayList<>();

        // 2. Lấy tất cả comment theo list subLessonId
        List<Long> subLessonIds = subLessons.stream()
                .map(SubLessonEntity::getId)
                .toList();

        List<CommentEntity> comments = commentRepository.findBySubLessonEntity_IdIn(subLessonIds);

        // 3. Convert sang DTO
        List<CommentDTO> commentDTOS = new ArrayList<>();
        for (CommentEntity comment : comments) {
            CommentDTO commentDTO = mapperConfiguration.toCommentDTO(comment);
            commentDTOS.add(commentDTO);
        }

        return commentDTOS;
    }

    @Override
    public CommentDTO createComment(
            CommentDTO commentDTO,
            Long userId
    ) {

        /**
         * Kiểm tra User tồn tại thông qua User-Service.
         */
        UserDTO userDTO;

        try {

            userDTO = userClient.getUserById(userId).getData();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Không tồn tại người dùng có id: "
                            + userId
            );
        }

        /**
         * Kiểm tra SubLesson tồn tại.
         */
        SubLessonEntity subLessonEntity =
                subLessonRepository.findById(
                        commentDTO.getSubLessonId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tồn tại bài học"
                        )
                );

        /**
         * Tạo Comment.
         */
        CommentEntity commentEntity =
                new CommentEntity();

        commentEntity.setStatus(1);

        commentEntity.setComment(
                commentDTO.getComment()
        );

        /**
         * Chỉ lưu userId.
         */
        commentEntity.setUserId(userId);

        commentEntity.setSubLessonEntity(
                subLessonEntity
        );

        commentEntity.setParentId(
                commentDTO.getParentId()
        );

        commentEntity =
                commentRepository.save(
                        commentEntity
                );

        /**
         * Mapping CommentEntity -> CommentDTO.
         */
        CommentDTO comment =
                mapperConfiguration.toCommentDTO(
                        commentEntity
                );

        /**
         * Comment mới chắc chắn là của User hiện tại.
         */
        comment.setMe(1);

        /**
         * Lấy thông tin User từ User-Service.
         */
        comment.setUserName(
                userDTO.getUsername()
        );

        comment.setUserAvatar(
                userDTO.getAvatarUrl()
        );

        return comment;
    }

    @Override
    public CommentDTO removeComment(
            Long id,
            Long userId
    ) {

        /**
         * Tìm Comment.
         */
        CommentEntity commentEntity =
                commentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Comment không tồn tại"
                                )
                        );

        /**
         * Kiểm tra User có phải chủ Comment không.
         *
         * Không cần UserEntity.
         */
        if (!commentEntity.getUserId().equals(userId)) {

            throw new RuntimeException(
                    "Bạn không được phép xoá"
            );
        }

        /**
         * Xóa mềm.
         */
        commentEntity.setStatus(0);

        commentRepository.save(
                commentEntity
        );

        /**
         * Lấy User từ User-Service.
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
         * Mapping sang DTO.
         */
        CommentDTO comment =
                mapperConfiguration.toCommentDTO(
                        commentEntity
                );

        comment.setMe(0);

        comment.setUserName(
                userDTO.getUsername()
        );

        comment.setUserAvatar(
                userDTO.getAvatarUrl()
        );

        /**
         * Nội dung comment sau khi xóa.
         */
        comment.setComment(
                "Tin nhắn đã bị xoá"
        );

        return comment;
    }
}
