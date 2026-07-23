package com.coursedemy.course.service;

import com.coursedemy.course.dto.CommentDTO;

import java.util.List;

public interface CommentService {

    List<CommentDTO> getCommentsBuSublessonId(Long sublessonId, Long userId);

    List<CommentDTO> getCommentsByCourseId(Long courseId);

    CommentDTO createComment(CommentDTO commentDTO, Long userId);

    CommentDTO removeComment(Long id, Long userId);
}
