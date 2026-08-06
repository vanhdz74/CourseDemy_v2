package com.coursedemy.course.client;

import com.coursedemy.course.dto.RevenueDTO;
import com.coursedemy.course.dto.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(
        name = "order-service"
)
public interface OrderClient {

    @GetMapping("/revenue-by-category")
    List<RevenueDTO.RevenueByCategoryDTO> getRevenueByCategory();

    @GetMapping("/internal/revenue/top-courses")
    ApiResponse<List<RevenueDTO.TopCourseDTO>> getTopCoursesRevenue();
}
