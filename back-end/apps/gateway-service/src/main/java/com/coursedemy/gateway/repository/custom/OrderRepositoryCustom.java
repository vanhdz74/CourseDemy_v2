package com.coursedemy.gateway.repository.custom;

import com.coursedemy.gateway.dto.RevenueDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepositoryCustom {
    List<RevenueDTO.RevenueByMonthDTO> getRevenueByMonth(Long teacherId, Long courseId, boolean isTeacher);

    List<RevenueDTO.TopCourseDTO> getTopCoursesRevenue();

    List<RevenueDTO.RevenueByCategoryDTO> getRevenueByCategory();

    List<RevenueDTO.DailyRevenueDTO> getDailyRevenue(LocalDateTime fromdate, LocalDateTime todate);
}
