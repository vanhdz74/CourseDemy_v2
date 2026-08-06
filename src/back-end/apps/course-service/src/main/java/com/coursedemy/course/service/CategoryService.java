package com.coursedemy.course.service;

import com.coursedemy.course.dto.CategoryDTO;
import com.coursedemy.course.dto.RevenueDTO;

import java.util.List;

public interface CategoryService {
    List<CategoryDTO> getAllCategories();

    List<RevenueDTO.RevenueByCategoryDTO> getRevenueByCategory();

    void createCategory(CategoryDTO categoryDTO);

    void deleteCategory(Long id);
}
