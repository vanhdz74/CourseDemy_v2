package com.coursedemy.course.controller;

import com.coursedemy.course.dto.CategoryDTO;
import com.coursedemy.course.dto.RevenueDTO;
import com.coursedemy.common.dto.response.ApiResponse;
import com.coursedemy.course.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategotyController {

    private final CategoryService categoryService;

    // Lấy danh sách category
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.getAllCategories()));
    }

    // POST: Taọ danh mục mới
    @PostMapping("/category")
    public ResponseEntity<ApiResponse<Void>> createCategory(@RequestBody CategoryDTO categoryDTO) {
        categoryService.createCategory(categoryDTO);
        return ResponseEntity.ok(ApiResponse.ok("Thêm danh mục thành công", null));
    }

    // POST: Cập nhật danh mục
    @PutMapping("/category")
    public ResponseEntity<ApiResponse<Void>> updateCategory(@RequestBody CategoryDTO categoryDTO) {
        categoryService.createCategory(categoryDTO);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật danh mục thành công", null));
    }

    @DeleteMapping("/category/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Integer id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.ok("Xoá danh mục thành công", null));
    }

    // GET: Lấy doanh thu từ các danh mục
    @GetMapping("/revenue-categories")
    public ResponseEntity<ApiResponse<List<RevenueDTO.RevenueByCategoryDTO>>> getRevenueByCategory() {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.getRevenueByCategory()));
    }
}
