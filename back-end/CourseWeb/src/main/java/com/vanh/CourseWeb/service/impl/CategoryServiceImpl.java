package com.vanh.CourseWeb.service.impl;

import com.vanh.CourseWeb.configurations.MapperConfiguration;
import com.vanh.CourseWeb.dto.CategoryDTO;
import com.vanh.CourseWeb.entity.CategoryEntity;
import com.vanh.CourseWeb.repository.CategoryRepository;
import com.vanh.CourseWeb.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@RequiredArgsConstructor // thay authrided
@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final MapperConfiguration  mapperConfiguration;

    @Override
    public List<CategoryDTO> getAllCategories() {
        List<CategoryEntity> categoryEntities = categoryRepository.findAll();
        List<CategoryDTO> result = new ArrayList<CategoryDTO>();
        for (CategoryEntity item : categoryEntities) {
            CategoryDTO category = new CategoryDTO();
            category.setId(item.getId());
            category.setName(item.getName());
            result.add(category);
        }
        return result;
    }
}
