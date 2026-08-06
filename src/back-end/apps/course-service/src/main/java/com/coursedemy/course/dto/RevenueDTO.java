package com.coursedemy.course.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RevenueDTO {

    @Data
    @AllArgsConstructor
    public static class RevenueByMonthDTO {
        private Integer month;
        private Double revenue;
        private Integer orders;
        private Integer students;
        private Integer avgOrder;

        public RevenueByMonthDTO(Integer month, Double revenue, Long orders) {
        }
    }

    @Data
    @AllArgsConstructor
    public static class TopCourseDTO {
        private CourseDTO course;
        private Double revenue;
        private Integer students;
    }

    @Data
    @AllArgsConstructor
    public static class RevenueByCategoryDTO {
        private String category;
        private Double revenue;
        private Double percent;
    }

    @Data
    @AllArgsConstructor
    public static class DailyRevenueDTO {
        private String day;
        private Double revenue;
    }
}
