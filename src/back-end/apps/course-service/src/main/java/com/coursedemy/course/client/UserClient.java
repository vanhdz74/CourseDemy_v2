package com.coursedemy.course.client;


import com.coursedemy.course.dto.request.UserDTO;

import com.coursedemy.course.dto.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "user-service",path = "/user")
public interface UserClient {
    @GetMapping("/internal/users/{id}/role")
    ApiResponse<String> getRoleByUserId(@PathVariable("id") Long id);

    @GetMapping("/internal/users/{id}/course-ids")
    ApiResponse<List<Long>> getCourseIdsByUserId(@PathVariable("id") Long id);


    @GetMapping("/{id}")
    ApiResponse<UserDTO> getUserById(
            @PathVariable("id") Long id
    );
}
