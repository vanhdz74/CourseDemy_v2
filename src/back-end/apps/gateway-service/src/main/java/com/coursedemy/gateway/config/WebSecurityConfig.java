package com.coursedemy.gateway.config;

import com.coursedemy.gateway.filter.JwtTokenFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@RequiredArgsConstructor
@EnableReactiveMethodSecurity
public class WebSecurityConfig {

    private final JwtTokenFilter jwtTokenFilter;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(
            ServerHttpSecurity http
    ) {

        return http

                .csrf(
                        ServerHttpSecurity.CsrfSpec::disable
                )

                // =================================================
                // JWT FILTER
                // =================================================

                .addFilterAt(
                        jwtTokenFilter,
                        SecurityWebFiltersOrder.AUTHENTICATION
                )

                // =================================================
                // AUTHORIZATION
                // =================================================

                .authorizeExchange(exchange -> exchange

                        .pathMatchers(
                                "/register",
                                "/login",
                                "/refresh-token",
                                "/send-otp",
                                "/verify-otp"
                        )
                        .permitAll()

                        .pathMatchers(
                                "/categories/**",
//                                "/course/**",

                                "/public/**",
                                "/reviews/**"
                        )
                        .permitAll()

                        .pathMatchers(
                                "/payment/**",
                                "/ipn/**"
                        )
                        .permitAll()

                        .pathMatchers(
                                "/user/all"
                        )
                        .hasRole("ADMIN")

                        .pathMatchers(
                                "/user/**"
                        )
                        .authenticated()

                        .pathMatchers(
                                "/cart/**"
                        )
                        .hasRole("STUDENT")

                        .pathMatchers(
                                "/course","/courses/**",
                                "/course/**",
                                "/upload-course-img/**"
                        )
                        .hasAnyRole(
                                "TEACHER",
                                "ADMIN"
                        )

                        .pathMatchers(
                                "/checkout"
                        )
                        .authenticated()

                        .pathMatchers(
                                "/payment/success/**"
                        )
                        .hasRole("ADMIN")

                        .pathMatchers(
                                "/lesson/**",
                                "/sublesson/**"
                        )
                        .hasAnyRole(
                                "TEACHER",
                                "ADMIN"
                        )

                        .pathMatchers(
                                "/transaction/**"
                        )
                        .hasRole("ADMIN")

                        .pathMatchers(
                                "/comments/**",
                                "/comment/**",
                                "/review"
                        )
                        .authenticated()

                        .pathMatchers(
                                "/revenue-by-month"
                        )
                        .hasAnyRole(
                                "TEACHER",
                                "ADMIN"
                        )

                        .pathMatchers(
                                "/category"
                        )
                        .hasRole("ADMIN")

                        .pathMatchers(
                                "/reset-password"
                        )
                        .authenticated()

                        .anyExchange()
                        .authenticated()
                )

                .build();
    }
}