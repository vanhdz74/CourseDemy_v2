package com.coursedemy.gateway.config;

import com.coursedemy.gateway.filter.JwtTokenFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.reactive.CorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
@EnableReactiveMethodSecurity
public class WebSecurityConfig {

    private final JwtTokenFilter jwtTokenFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(
            ServerHttpSecurity http
    ) {

        return http

                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                .csrf(
                        ServerHttpSecurity.CsrfSpec::disable
                )

                .httpBasic(
                        ServerHttpSecurity.HttpBasicSpec::disable
                )

                .formLogin(
                        ServerHttpSecurity.FormLoginSpec::disable
                )

                .exceptionHandling(exceptionHandlingSpec -> exceptionHandlingSpec
                        .authenticationEntryPoint((exchange, ex) -> {
                            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        })
                        .accessDeniedHandler((exchange, denied) -> {
                            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                            return exchange.getResponse().setComplete();
                        })
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
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()

                        .pathMatchers(
                                "/register",
                                "/login",
                                "/refresh-token",
                                "/send-otp",
                                "/verify-otp"
                        )
                        .permitAll()

                        .pathMatchers(
                                HttpMethod.GET,
                                "/categories",
                                "/categories/**",
                                "/course/search",
                                "/courses/search",
                                "/course/category/**",
                                "/courses/category/**",
                                "/course/course-detail/**",
                                "/courses/course-detail/**",
                                "/course/revenue/top-courses",
                                "/courses/revenue/top-courses",
                                "/course/*",
                                "/courses/*",
                                "/lessons/**",
                                "/sublessons/**",
                                "/sublesson/**",
                                "/lesson/**",
                                "/public/**",
                                "/reviews/**"
                        )
                        .permitAll()

                        .pathMatchers(
                                "/payment/**",
                                "/api/payment/**",
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
                        .hasAnyRole("STUDENT", "ADMIN")

                        .pathMatchers(
                                "/course",
                                "/courses/**",
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
                                HttpMethod.POST,
                                "/lesson/**",
                                "/sublesson/**",
                                "/upload-video/**"
                        )
                        .hasAnyRole(
                                "TEACHER",
                                "ADMIN"
                        )

                        .pathMatchers(
                                HttpMethod.PUT,
                                "/lesson/**",
                                "/sublesson/**"
                        )
                        .hasAnyRole(
                                "TEACHER",
                                "ADMIN"
                        )

                        .pathMatchers(
                                HttpMethod.DELETE,
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
