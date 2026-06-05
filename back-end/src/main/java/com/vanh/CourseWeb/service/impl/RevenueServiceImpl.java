package com.vanh.CourseWeb.service.impl;

import com.vanh.CourseWeb.dto.RevenueDTO;
import com.vanh.CourseWeb.repository.OrderRepository;
import com.vanh.CourseWeb.repository.custom.OrderRepositoryCustom;
import com.vanh.CourseWeb.service.RevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RevenueServiceImpl implements RevenueService {
    private final OrderRepository orderRepository;

    @Override
    public List<RevenueDTO.DailyRevenueDTO> getRevenueByDays(String roleName, LocalDate fromdate, LocalDate todate) throws Exception {
        if (!roleName.equals("ADMIN")) {
            throw new Exception("Bạn không có quyền");
        }

        LocalDateTime from = fromdate != null
                ? fromdate.atStartOfDay()
                : null;

        LocalDateTime to = todate != null
                ? todate.atTime(23, 59, 59)
                : null;

        return orderRepository.getDailyRevenue(from, to);
    }
}
