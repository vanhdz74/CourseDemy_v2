package com.vanh.CourseWeb.controller;

import com.vanh.CourseWeb.dto.CategoryDTO;
import com.vanh.CourseWeb.dto.RevenueDTO;
import com.vanh.CourseWeb.entity.CategoryEntity;
import com.vanh.CourseWeb.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CategotyController {

    private final CategoryService categoryService;

    // Lấy danh sách category
    @GetMapping("/categories")
    public List<CategoryDTO> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories();
        return categories;
    }

    // POST: Taọ danh mục mới
    @PostMapping("/category")
    public ResponseEntity<?> createCategory(@RequestBody CategoryDTO categoryDTO) {
        try {
            categoryService.createCategory(categoryDTO);
            return ResponseEntity.ok(Map.of("message", "Thêm danh mục thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // POST: Cập nhật danh mục
    @PutMapping("/category")
    public ResponseEntity<?> updateCategory(@RequestBody CategoryDTO categoryDTO) {
        try {
            categoryService.createCategory(categoryDTO);
            return ResponseEntity.ok(Map.of("message", "Cập nhật danh mục thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/category/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok(Map.of("message", "Xoá danh mục thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // GET: Lấy doanh thu từ các danh mục
    @GetMapping("/revenue-categories")
    public ResponseEntity<List<RevenueDTO.RevenueByCategoryDTO>> getRevenueByCategory() {
        return ResponseEntity.ok(
                categoryService.getRevenueByCategory()
        );
    }
}
