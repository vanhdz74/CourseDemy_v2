package com.vanh.CourseWeb.controller;

import com.vanh.CourseWeb.dto.RevenueDTO;
import com.vanh.CourseWeb.entity.UserEntity;
import com.vanh.CourseWeb.service.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class RevenueController {
    private final RevenueService revenueService;

    // GET: Lấy doanh thu theo thời gian được chọn
    @GetMapping("/revenue-by-days")
    public List<RevenueDTO.DailyRevenueDTO> getRevenueByDays(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            Authentication authentication
    ) throws Exception {
        UserEntity user = (UserEntity) authentication.getPrincipal();
        return revenueService.getRevenueByDays(user.getRoleEntity().getRoleName(), fromDate,
                toDate);
    }
}
