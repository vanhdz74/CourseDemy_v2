package com.coursedemy.enrollment.config;

import com.coursedemy.enrollment.entity.RoleEntity;
import com.coursedemy.enrollment.filter.JwtTokenFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.parameters.P;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import static org.springframework.http.HttpMethod.*;

@Configuration
@EnableWebSecurity
@EnableWebMvc
@RequiredArgsConstructor
public class WebSecurityConfig {

    @Value("${api.prefix}")
    private String apiPrefix;

    private final JwtTokenFilter jwtTokenFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                //  Kích hoạt CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                //  Tắt CSRF (vì bạn dùng JWT)
//                .csrf(AbstractHttpConfigurer::disable)
                .csrf(customizer -> customizer.disable())

                //  Thêm JWT filter
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)

                //  Luật phân quyền
                .authorizeHttpRequests(requests -> requests
                                .requestMatchers(
                                        String.format("%s/register", apiPrefix),
                                        String.format("%s/login", apiPrefix),
                                        String.format("%s/refresh-token", apiPrefix),
                                        String.format("%s/categories/**", apiPrefix),
                                        String.format("%s/courses/**", apiPrefix),
                                        ("/course/**"),
                                        ("/course-detail/{id}"),
                                        ("/cart/add"),
                                        ("/api/payment/{provider}/ipn**"),
                                        ("/api/payment/{provider}/return**"),
                                        ("/public/lessons/course/{id}"),
                                        ("/public/sublessons/lesson/{id}"),
                                        ("/reviews/**"),
                                        ("/revenue/top-courses"),
                                        ("/revenue-categories"),
                                        ("/send-otp"),
                                        ("/verify-otp")
//                                        ("/")
//                                ("/upload-len")
                                ).permitAll()

                                // user
                                .requestMatchers(GET, "/user/all").hasRole(RoleEntity.ADMIN)
                                .requestMatchers(GET, "/user/{id}").authenticated()
                                .requestMatchers(POST, "/user").hasRole(RoleEntity.ADMIN)
                                .requestMatchers(DELETE, "/user/{id}").authenticated()
                                .requestMatchers(POST, "/user/upload-avatar").authenticated()
                                .requestMatchers(PUT, "/user/update/{id}").authenticated()
                                .requestMatchers(DELETE, "/user/delete/{id}").hasAnyRole(RoleEntity.STUDENT, RoleEntity.ADMIN)
                                .requestMatchers(PUT, "/course-detail/m1/*").hasAnyRole(RoleEntity.ADMIN, RoleEntity.TEACHER)
                                .requestMatchers(GET, "/users/course/{id}").hasAnyRole(RoleEntity.ADMIN, RoleEntity.TEACHER)
                                .requestMatchers(POST, "/courses/{id}/students").hasAnyRole(RoleEntity.ADMIN, RoleEntity.TEACHER)
                                .requestMatchers(DELETE, "/courses/{course_id}/students/{student_id}").hasAnyRole(RoleEntity.ADMIN, RoleEntity.TEACHER)

                                // cart
                                .requestMatchers(DELETE, "/cart/remove*").hasRole(RoleEntity.STUDENT)
                                .requestMatchers(POST, "/cart/{id}").hasRole(RoleEntity.STUDENT)

                                //course
                                .requestMatchers(GET, "/courses/user/{id}").authenticated()
                                .requestMatchers(POST, "/course").hasAnyRole(RoleEntity.TEACHER, RoleEntity.ADMIN)
                                .requestMatchers(DELETE, "/course/{id}").hasAnyRole(RoleEntity.TEACHER, RoleEntity.ADMIN)
                                .requestMatchers(PUT, "/course/{id}").hasAnyRole(RoleEntity.TEACHER, RoleEntity.ADMIN)
                                .requestMatchers(POST, "/upload-course-img/{id}").hasAnyRole(RoleEntity.TEACHER, RoleEntity.ADMIN)

                                // payment
                                .requestMatchers(POST, "/checkout").authenticated()
                                .requestMatchers(POST, "/payment/success/**").hasRole(RoleEntity.ADMIN)
                                .requestMatchers(POST, "/api/payment/create**").authenticated()

                                // lesson, sublesson
                                .requestMatchers(GET, "/lessons/course/{id}").authenticated()
                                .requestMatchers(GET, "/sublesson/{id}").authenticated()
                                .requestMatchers(DELETE, "/sublesson/{id}").hasAnyRole(RoleEntity.TEACHER, RoleEntity.ADMIN)
                                .requestMatchers(POST, "/lesson/{lessonId}/sublesson/add-relative").hasRole(RoleEntity.TEACHER)
                                .requestMatchers(POST, "/lesson/**").hasAnyRole(RoleEntity.TEACHER, RoleEntity.ADMIN)
                                .requestMatchers(DELETE, "/lesson/**").hasAnyRole(RoleEntity.TEACHER, RoleEntity.ADMIN)
                                .requestMatchers(PUT, "/lesson/**").hasAnyRole(RoleEntity.TEACHER, RoleEntity.ADMIN)
                                .requestMatchers(PUT, "/sublesson/reorder").hasAnyRole(RoleEntity.TEACHER, RoleEntity.ADMIN)
                                .requestMatchers(POST, "/sublesson/lesson/**").hasAnyRole(RoleEntity.TEACHER, RoleEntity.ADMIN)

                                // transaction
                                .requestMatchers(GET, "/transaction/**").hasRole(RoleEntity.ADMIN)

                                // thread & reply
                                .requestMatchers(GET, "/comments/**").authenticated()
                                .requestMatchers(POST, "/comment").authenticated()
                                .requestMatchers(DELETE, "/comment/{id}").authenticated()
                                .requestMatchers(POST, "/review").authenticated()

                                // reveune
                                .requestMatchers(GET, "/revenue-by-month").hasAnyRole(RoleEntity.TEACHER, RoleEntity.ADMIN)

                                // category
                                .requestMatchers(POST, "/category").hasAnyRole(RoleEntity.ADMIN)

                                // auth
                                .requestMatchers(POST, "/reset-password").authenticated()

                                .anyRequest().authenticated()
                );

        return http.build();
    }
}
