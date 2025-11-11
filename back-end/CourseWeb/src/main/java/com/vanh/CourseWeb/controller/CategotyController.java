package com.vanh.CourseWeb.controller;

import com.vanh.CourseWeb.dto.CategoryDTO;
import com.vanh.CourseWeb.entity.CategoryEntity;
import com.vanh.CourseWeb.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategotyController {

    private final CategoryService categoryService;

    // Lấy danh sách category
    @GetMapping("")
    public List<CategoryDTO> getAllCategories(){
        List<CategoryDTO> categories = categoryService.getAllCategories();
        return categories;
    }
}
