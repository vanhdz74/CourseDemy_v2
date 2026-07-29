package com.coursedemy.user.client;

import com.coursedemy.user.dto.request.CourseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(
        name = "course-service",
        path = "/course"
)
public interface CourseFeignClient {

    @GetMapping("/{courseId}")
    CourseDTO getCourseById(@PathVariable("courseId") Long courseId);

    @PutMapping("/{courseId}/quantity/increase")
    void increaseQuantity(@PathVariable("courseId") Long courseId);

    @PutMapping("/{courseId}/quantity/decrease")
    void decreaseQuantity(@PathVariable("courseId") Long courseId);
}
