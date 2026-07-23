package com.coursedemy.order.service;

import com.coursedemy.order.dto.RevenueDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface RevenueService {

    List<RevenueDTO.DailyRevenueDTO> getRevenueByDays(String roleName, LocalDate fromdate, LocalDate todate) throws Exception;
}
