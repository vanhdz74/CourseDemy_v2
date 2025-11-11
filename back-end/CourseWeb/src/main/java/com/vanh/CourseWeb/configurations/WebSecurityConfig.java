package com.vanh.CourseWeb.configurations;

import com.vanh.CourseWeb.entity.RoleEntity;
import com.vanh.CourseWeb.filter.JwtTokenFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
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
                .csrf(AbstractHttpConfigurer::disable)

                //  Thêm JWT filter
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)

                //  Luật phân quyền
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers(
                                String.format("%s/register", apiPrefix),
                                String.format("%s/login", apiPrefix),
                                String.format("%s/categories/**", apiPrefix),
                                String.format("%s/courses/**", apiPrefix),
                                ("/course/**"),
                                ("/cart/add")

                        ).permitAll()

                        .requestMatchers(GET, "/user/all").hasRole(RoleEntity.ADMIN)
                        .requestMatchers(GET, "/user/{id}").authenticated()
                        .requestMatchers(POST, "/user/upload-avatar").authenticated()
                        .requestMatchers(PUT, "/user/update/{id}").authenticated()
                        .requestMatchers(DELETE, "/user/delete/{id}").hasAnyRole(RoleEntity.STUDENT, RoleEntity.ADMIN)
                        .requestMatchers(GET, "/lessons/course/{id}").authenticated()
                        .requestMatchers(POST, "/cart/{id}").hasRole(RoleEntity.STUDENT)
                        .requestMatchers(GET, "/courses/student/{id}").authenticated()
                        .requestMatchers(POST, "/checkout/cart").authenticated()
                        .requestMatchers(POST, "/payment/success/**").hasRole(RoleEntity.ADMIN)

                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
