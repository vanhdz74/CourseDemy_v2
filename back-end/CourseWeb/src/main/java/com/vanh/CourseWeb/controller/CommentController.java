package com.vanh.CourseWeb.controller;

import com.vanh.CourseWeb.dto.CommentDTO;
import com.vanh.CourseWeb.entity.UserEntity;
import com.vanh.CourseWeb.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    // GET: Lấy ra hết comments của 1 sub_lesson
    @GetMapping("/comments/sublesson/{sublesson_id}")
    public List<CommentDTO> getCommentsBySublessonId(
            @PathVariable Long sublesson_id,
            Authentication authentication) {
        UserEntity userEntity = (UserEntity) authentication.getPrincipal();
        Long userId = userEntity.getId();
        return commentService.getCommentsBuSublessonId(sublesson_id, userId);
    }

    // GET: Lấy ra comments của toàn khoá
    @GetMapping("/comments/course/{course_id}")
    public List<CommentDTO> getCommentsByCourseId(@PathVariable Long course_id) {
        return commentService.getCommentsByCourseId(course_id);
    }

    // GET: Tạo 1 comment
    @PostMapping("/comment")
    public ResponseEntity<?> createComment(
            @RequestBody CommentDTO commentDTO,
            Authentication authentication
    ) {
        try {
            UserEntity userEntity = (UserEntity) authentication.getPrincipal();
            Long userId = userEntity.getId();

            CommentDTO comment = commentService.createComment(commentDTO, userId);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            // Các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE: xoá comment
    @DeleteMapping("/comment/{id}")
    public ResponseEntity<?> removeComment(@PathVariable Long id, Authentication authentication) {
        try {
            UserEntity userEntity = (UserEntity) authentication.getPrincipal();
            Long userId = userEntity.getId();

            CommentDTO commentDTO = commentService.removeComment(id, userId);
            return ResponseEntity.ok(commentDTO);
        } catch (Exception e) {
            // Các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
