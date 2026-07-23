package com.coursedemy.course.controller;

import com.coursedemy.course.dto.CommentDTO;
import com.coursedemy.common.dto.response.ApiResponse;
import com.coursedemy.course.entity.UserEntity;
import com.coursedemy.course.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    // GET: Lấy ra hết comments của 1 sub_lesson
    @GetMapping("/comments/sublesson/{sublesson_id}")
    public ResponseEntity<ApiResponse<List<CommentDTO>>> getCommentsBySublessonId(
            @PathVariable Long sublesson_id,
            Authentication authentication) {
        UserEntity userEntity = (UserEntity) authentication.getPrincipal();
        Long userId = userEntity.getId();
        return ResponseEntity.ok(ApiResponse.ok(commentService.getCommentsBuSublessonId(sublesson_id, userId)));
    }

    // GET: Lấy ra comments của toàn khoá
    @GetMapping("/comments/course/{course_id}")
    public ResponseEntity<ApiResponse<List<CommentDTO>>> getCommentsByCourseId(@PathVariable Long course_id) {
        return ResponseEntity.ok(ApiResponse.ok(commentService.getCommentsByCourseId(course_id)));
    }

    // GET: Tạo 1 comment
    @PostMapping("/comment")
    public ResponseEntity<ApiResponse<CommentDTO>> createComment(
            @RequestBody CommentDTO commentDTO,
            Authentication authentication
    ) {
        UserEntity userEntity = (UserEntity) authentication.getPrincipal();
        Long userId = userEntity.getId();
        CommentDTO comment = commentService.createComment(commentDTO, userId);
        return ResponseEntity.ok(ApiResponse.ok(comment));
    }

    // DELETE: xoá comment
    @DeleteMapping("/comment/{id}")
    public ResponseEntity<ApiResponse<CommentDTO>> removeComment(@PathVariable Long id, Authentication authentication) {
        UserEntity userEntity = (UserEntity) authentication.getPrincipal();
        Long userId = userEntity.getId();
        CommentDTO commentDTO = commentService.removeComment(id, userId);
        return ResponseEntity.ok(ApiResponse.ok(commentDTO));
    }
}
