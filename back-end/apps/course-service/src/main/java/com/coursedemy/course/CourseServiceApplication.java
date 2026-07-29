package com.coursedemy.course;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableFeignClients
public class CourseServiceApplication {
    public static void main(String[] args) {

        SpringApplication.run(CourseServiceApplication.class, args);

    }
}
