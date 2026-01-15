package com.vanh.CourseWeb.service;

import com.vanh.CourseWeb.dto.RevenueDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface RevenueService {

    List<RevenueDTO.DailyRevenueDTO> getRevenueByDays(String roleName, LocalDate fromdate, LocalDate todate) throws Exception;
}
