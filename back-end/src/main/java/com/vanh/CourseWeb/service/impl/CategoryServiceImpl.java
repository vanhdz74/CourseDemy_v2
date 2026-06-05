package com.vanh.CourseWeb.service.impl;

import com.vanh.CourseWeb.configurations.MapperConfiguration;
import com.vanh.CourseWeb.dto.CategoryDTO;
import com.vanh.CourseWeb.dto.RevenueDTO;
import com.vanh.CourseWeb.entity.CategoryEntity;
import com.vanh.CourseWeb.repository.CategoryRepository;
import com.vanh.CourseWeb.repository.OrderRepository;
import com.vanh.CourseWeb.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor // thay authrided
@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final MapperConfiguration mapperConfiguration;
    private final OrderRepository orderRepository;

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

    @Override
    public List<RevenueDTO.RevenueByCategoryDTO> getRevenueByCategory() {
        List<RevenueDTO.RevenueByCategoryDTO> data =
                orderRepository.getRevenueByCategory();

        double totalRevenue = data.stream()
                .mapToDouble(RevenueDTO.RevenueByCategoryDTO::getRevenue)
                .sum();

        return data.stream()
                .map(d -> new RevenueDTO.RevenueByCategoryDTO(
                        d.getCategory(),
                        d.getRevenue(),
                        new Double(Math.round(d.getRevenue() * 100 / totalRevenue))
                ))
                .toList();
    }

    @Override
    public void createCategory(CategoryDTO categoryDTO) {
        Optional<CategoryEntity> categoryEntity = categoryRepository.findByName(categoryDTO.getName());
        if (categoryEntity.isPresent()) {
            throw new IllegalStateException("Danh mục đã tồn tại");
        }
        CategoryEntity newCategory = new CategoryEntity();
        newCategory.setName(categoryDTO.getName());
        categoryRepository.save(newCategory);
    }

    @Override
    public void deleteCategory(Integer id) {
        CategoryEntity categoryEntity = categoryRepository.findById(id).orElse(null);
        categoryRepository.delete(categoryEntity);
    }
}
