package com.vanh.CourseWeb.service.impl;

import com.vanh.CourseWeb.configurations.MapperConfiguration;
import com.vanh.CourseWeb.dto.CommentDTO;
import com.vanh.CourseWeb.entity.*;
import com.vanh.CourseWeb.repository.*;
import com.vanh.CourseWeb.service.CommentService;
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
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    @Override
    public List<CommentDTO> getCommentsBuSublessonId(Long sublessonId, Long userAuId) {
        Optional<SubLessonEntity> subLessonEntity = subLessonRepository.findById(sublessonId);
        if (subLessonEntity.isEmpty()) {
            throw new RuntimeException(("Không tồn tại bài học này có id: " + sublessonId));
        }

        List<CommentDTO> commentDTOS = new ArrayList<>();
        List<CommentEntity> commentEntities = commentRepository.findAllBySubLessonEntity_Id(sublessonId);
        for (CommentEntity comment : commentEntities) {
            Optional<UserEntity> user = userRepository.findById(comment.getUserEntity().getId());
            if (user.isEmpty()) {
                throw new RuntimeException("User không tồn tại");
            }

            CommentDTO commentDTO = new CommentDTO();
            commentDTO = mapperConfiguration.toCommentDTO(comment);
            if (user.get().getId().equals(userAuId)) {
                commentDTO.setMe(1);
            }
            if (comment.getStatus() == 0) {
                commentDTO.setComment("Tin nhắn đã bị xoá");
                commentDTO.setMe(0);
            } else {
                commentDTO.setComment(comment.getComment());
            }
            commentDTO.setUserName(user.get().getUsername());
            commentDTO.setUserAvatar(user.get().getAvatarUrl());

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
    public CommentDTO createComment(CommentDTO commentDTO, Long userId) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tồn tại ngừoi dùng có id: " + commentDTO.getUserId()));

        SubLessonEntity subLessonEntity = subLessonRepository.findById(commentDTO.getSubLessonId())
                .orElseThrow(() -> new RuntimeException("Không tồn tại bài học"));

        CommentEntity commentEntity = new CommentEntity();
        commentEntity.setStatus(1);
        commentEntity.setComment(commentDTO.getComment());
        commentEntity.setUserEntity(userEntity);
        commentEntity.setSubLessonEntity(subLessonEntity);
        commentEntity.setParentId(commentDTO.getParentId());

        commentEntity = commentRepository.save(commentEntity);

        CommentDTO comment = mapperConfiguration.toCommentDTO(commentEntity);
        comment.setMe(1);
        comment.setUserName(userEntity.getUsername());
        comment.setUserAvatar(userEntity.getAvatarUrl());
        return comment;
    }

    @Override
    public CommentDTO removeComment(Long id, Long userId) {
        CommentEntity commentEntity = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment không tồn tại"));

        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tồn tại ngừoi dùng có id: " + userId));

        if (commentEntity.getUserEntity().getId().equals(userId)) {
            commentEntity.setStatus(0);
        } else {
            throw new RuntimeException("Bạn không được phép xoá");
        }

        commentRepository.save(commentEntity);

        CommentDTO comment = mapperConfiguration.toCommentDTO(commentEntity);
        comment.setMe(0);
        comment.setUserName(userEntity.getUsername());
        comment.setUserAvatar(userEntity.getAvatarUrl());
        comment.setComment("Tin nhắn đã bị xoá");
        return comment;
    }
}
