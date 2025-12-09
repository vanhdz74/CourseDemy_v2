package com.vanh.CourseWeb.controller;

import com.vanh.CourseWeb.dto.CategoryDTO;
import com.vanh.CourseWeb.dto.RevenueDTO;
import com.vanh.CourseWeb.entity.CategoryEntity;
import com.vanh.CourseWeb.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

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

    // GET: Lấy doanh thu từ các danh mục
    @GetMapping("/revenue-categories")
    public ResponseEntity<List<RevenueDTO.RevenueByCategoryDTO>> getRevenueByCategory() {
        return ResponseEntity.ok(
                categoryService.getRevenueByCategory()
        );
    }
}
