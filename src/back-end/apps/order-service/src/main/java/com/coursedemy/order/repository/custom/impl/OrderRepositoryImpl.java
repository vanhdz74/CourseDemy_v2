package com.coursedemy.order.repository.custom.impl;

import com.coursedemy.order.mapper.MapperConfiguration;
import com.coursedemy.order.dto.CourseDTO;
import com.coursedemy.order.dto.RevenueDTO;
import com.coursedemy.order.entity.CourseEntity;
import com.coursedemy.order.repository.custom.OrderRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Repository
public class OrderRepositoryImpl implements OrderRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    private final MapperConfiguration mapperConfiguration = new MapperConfiguration();

    @Override
    public List<RevenueDTO.RevenueByMonthDTO> getRevenueByMonth(
            Long teacherId,
            Long courseId,
            boolean isTeacher
    ) {

        StringBuilder jpql = new StringBuilder();
        jpql.append("""
                    SELECT 
                        MONTH(o.paymentTime),
                        SUM(od.price),
                        COUNT(o.id),
                        COUNT(DISTINCT o.userEntity.id)
                    FROM OrderEntity o
                    JOIN o.orderDetailEntities od
                """);

        // Join course khi cần teacher hoặc course filter
        if (isTeacher || courseId != null) {
            jpql.append(" JOIN od.courseEntity c ");
        }

        jpql.append("""
                    WHERE o.status = 'SUCCESS'
                      AND YEAR(o.paymentTime) = YEAR(CURRENT_DATE)
                """);

        // Teacher filter
        if (isTeacher) {
            jpql.append(" AND c.user.id = :teacherId ");
        }

        // Course filter
        if (courseId != null) {
            jpql.append(" AND c.id = :courseId ");
        }

        jpql.append("""
                    GROUP BY MONTH(o.paymentTime)
                    ORDER BY MONTH(o.paymentTime)
                """);

        TypedQuery<Object[]> query =
                entityManager.createQuery(jpql.toString(), Object[].class);

        if (isTeacher) {
            if (teacherId == null) {
                throw new IllegalArgumentException("teacherId is required");
            }
            query.setParameter("teacherId", teacherId);
        }

        if (courseId != null) {
            query.setParameter("courseId", courseId);
        }

        List<Object[]> result = query.getResultList();

        // Init 12 months = 0
        Map<Integer, RevenueDTO.RevenueByMonthDTO> monthMap = new LinkedHashMap<>();
        for (int m = 1; m <= 12; m++) {
            monthMap.put(m, new RevenueDTO.RevenueByMonthDTO(
                    m, 0.0, 0, 0, 0
            ));
        }

        // Override data
        for (Object[] row : result) {
            int month = ((Number) row[0]).intValue();
            double revenue = row[1] != null ? ((Number) row[1]).doubleValue() : 0;
            int orders = row[2] != null ? ((Number) row[2]).intValue() : 0;
            int students = row[3] != null ? ((Number) row[3]).intValue() : 0;

            int avgOrder = orders > 0
                    ? (int) Math.round(revenue / orders)
                    : 0;

            monthMap.put(month, new RevenueDTO.RevenueByMonthDTO(
                    month, revenue, orders, students, avgOrder
            ));
        }

        return new ArrayList<>(monthMap.values());
    }

    @Override
    public List<RevenueDTO.TopCourseDTO> getTopCoursesRevenue() {

        String jpql = """
                    SELECT 
                        c.id,
                        SUM(od.price),
                        COUNT(DISTINCT o.userEntity.id)
                    FROM OrderEntity o
                    JOIN o.orderDetailEntities od
                    JOIN od.courseEntity c
                    WHERE o.status = 'SUCCESS'
                      AND YEAR(o.paymentTime) = YEAR(CURRENT_DATE)
                    GROUP BY c.id
                    ORDER BY SUM(od.price) DESC
                """;

        TypedQuery<Object[]> query =
                entityManager.createQuery(jpql, Object[].class);

        query.setMaxResults(5);

        List<Object[]> result = query.getResultList();
        List<RevenueDTO.TopCourseDTO> list = new ArrayList<>();

        for (Object[] row : result) {
            Long courseId = ((Number) row[0]).longValue();
            Double revenue = ((Number) row[1]).doubleValue();
            Integer students = ((Number) row[2]).intValue();

            CourseEntity courseEntity = entityManager.find(CourseEntity.class, courseId);
            CourseDTO courseDTO = mapperConfiguration.toCourseDTO(courseEntity);

            list.add(new RevenueDTO.TopCourseDTO(
                    courseDTO,
                    revenue,
                    students
            ));
        }

        return list;
    }

    @Override
    public List<RevenueDTO.RevenueByCategoryDTO> getRevenueByCategory() {

        String jpql = """
                    SELECT 
                        cat.name,
                        SUM(od.price)
                    FROM OrderEntity o
                    JOIN o.orderDetailEntities od
                    JOIN od.courseEntity c
                    JOIN c.category cat
                    WHERE o.status = 'SUCCESS'
                    GROUP BY cat.name
                """;

        List<Object[]> rawResult = entityManager
                .createQuery(jpql, Object[].class)
                .getResultList();

        // 1. Tính tổng doanh thu
        double totalRevenue = rawResult.stream()
                .mapToDouble(r -> ((Number) r[1]).doubleValue())
                .sum();

        // 2. Map sang DTO + percent
        List<RevenueDTO.RevenueByCategoryDTO> result = new ArrayList<>();

        for (Object[] row : rawResult) {
            String category = (String) row[0];
            double revenue = row[1] != null ? ((Number) row[1]).doubleValue() : 0;

            double percent = totalRevenue > 0
                    ? (double) Math.round((revenue / totalRevenue) * 100)
                    : 0;

            result.add(new RevenueDTO.RevenueByCategoryDTO(
                    category,
                    revenue,
                    percent
            ));
        }

        return result;
    }

    @Override
    public List<RevenueDTO.DailyRevenueDTO> getDailyRevenue(
            LocalDateTime fromDate,
            LocalDateTime toDate
    ) {

        StringBuilder jpql = new StringBuilder("""
                    SELECT 
                        FUNCTION('DATE_FORMAT', o.paymentTime, '%Y-%m-%d'),
                        SUM(o.totalPrice)
                    FROM OrderEntity o
                    WHERE o.status = 'SUCCESS'
                      AND o.paymentTime IS NOT NULL
                """);

        if (fromDate != null) {
            jpql.append(" AND o.paymentTime >= :fromDate ");
        }
        if (toDate != null) {
            jpql.append(" AND o.paymentTime <= :toDate ");
        }

        jpql.append("""
                    GROUP BY FUNCTION('DATE_FORMAT', o.paymentTime, '%Y-%m-%d')
                    ORDER BY FUNCTION('DATE_FORMAT', o.paymentTime, '%Y-%m-%d')
                """);

        TypedQuery<Object[]> query =
                entityManager.createQuery(jpql.toString(), Object[].class);

        if (fromDate != null) query.setParameter("fromDate", fromDate);
        if (toDate != null) query.setParameter("toDate", toDate);

        List<Object[]> rawResult = query.getResultList();

        // Map kết quả DB
        Map<LocalDate, Double> revenueMap = new HashMap<>();
        for (Object[] row : rawResult) {
            LocalDate day = LocalDate.parse((String) row[0]);
            double revenue = row[1] != null
                    ? ((Number) row[1]).doubleValue()
                    : 0d;
            revenueMap.put(day, revenue);
        }

        // Duyệt từ from → to, ngày thiếu = 0
        List<RevenueDTO.DailyRevenueDTO> result = new ArrayList<>();

        LocalDate start = fromDate.toLocalDate();
        LocalDate end = toDate.toLocalDate();

        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            double revenue = revenueMap.getOrDefault(date, 0d);
            result.add(new RevenueDTO.DailyRevenueDTO(
                    date.toString(),
                    revenue
            ));
        }

        return result;
    }


}
