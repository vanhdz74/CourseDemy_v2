package com.vanh.CourseWeb.service;

import com.vanh.CourseWeb.dto.CategoryDTO;
import com.vanh.CourseWeb.dto.RevenueDTO;

import java.util.List;

public interface CategoryService {
    List<CategoryDTO> getAllCategories();

    List<RevenueDTO.RevenueByCategoryDTO> getRevenueByCategory();
}

