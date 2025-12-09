package com.vanh.CourseWeb.repository.custom;

import com.vanh.CourseWeb.dto.RevenueDTO;

import java.util.List;

public interface OrderRepositoryCustom {
    List<RevenueDTO.RevenueByMonthDTO> getRevenueByMonth(Long teacherId, Long courseId, boolean isTeacher);

    List<RevenueDTO.TopCourseDTO> getTopCoursesRevenue();

    List<RevenueDTO.RevenueByCategoryDTO> getRevenueByCategory();
}
