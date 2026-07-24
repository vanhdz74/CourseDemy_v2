package com.coursedemy.gateway.filter;

import com.coursedemy.gateway.entity.UserEntity;
import com.coursedemy.gateway.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter implements WebFilter {

    @Value("${api.prefix}")
    private String apiPrefix;

    private final UserDetailsService userDetailsService;
    private final JwtTokenUtil jwtTokenUtil;


    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange,
            WebFilterChain chain
    ) {

        ServerHttpRequest request = exchange.getRequest();

        String path = request.getURI().getPath();

        String method = request.getMethod() != null
                ? request.getMethod().name()
                : "";


        // =========================================================
        // 1. KIỂM TRA API CÓ ĐƯỢC BYPASS JWT HAY KHÔNG
        // =========================================================

        if (isBypassToken(path, method)) {

            return chain.filter(exchange);
        }


        // =========================================================
        // 2. LẤY AUTHORIZATION HEADER
        // =========================================================

        String authHeader = request.getHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);


        // =========================================================
        // 3. KHÔNG CÓ TOKEN
        // =========================================================

        if (authHeader == null
                || !authHeader.startsWith("Bearer ")) {

            return unauthorized(exchange);
        }


        // =========================================================
        // 4. LẤY TOKEN
        // =========================================================

        String token = authHeader.substring(7);


        try {

            // =====================================================
            // 5. LẤY EMAIL TỪ JWT
            // =====================================================

            String email = jwtTokenUtil.extractEmail(token);


            if (email == null || email.isBlank()) {

                return unauthorized(exchange);
            }


            // =====================================================
            // 6. LOAD USER TỪ DATABASE
            // =====================================================

            UserEntity userDetails =
                    (UserEntity) userDetailsService
                            .loadUserByUsername(email);


            // =====================================================
            // 7. VALIDATE JWT
            // =====================================================

            if (!jwtTokenUtil.validateAccessToken(
                    token,
                    userDetails
            )) {

                return unauthorized(exchange);
            }


            // =====================================================
            // 8. TẠO AUTHENTICATION
            //
            // userDetails.getAuthorities()
            //
            // Ví dụ:
            //
            // ROLE_ADMIN
            // ROLE_TEACHER
            // ROLE_STUDENT
            // =====================================================

            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );


            // =====================================================
            // 9. TẠO SECURITY CONTEXT
            // =====================================================

            SecurityContext securityContext =
                    new SecurityContextImpl(authentication);


            // =====================================================
            // 10. LƯU AUTHENTICATION VÀO
            // REACTIVE SECURITY CONTEXT
            // =====================================================

            return chain
                    .filter(exchange)
                    .contextWrite(
                            ReactiveSecurityContextHolder
                                    .withSecurityContext(
                                            Mono.just(securityContext)
                                    )
                    );


        } catch (Exception e) {

            return unauthorized(exchange);
        }
    }


    // =============================================================
    // UNAUTHORIZED
    // =============================================================

    private Mono<Void> unauthorized(
            ServerWebExchange exchange
    ) {

        exchange.getResponse()
                .setStatusCode(
                        HttpStatus.UNAUTHORIZED
                );

        return exchange.getResponse()
                .setComplete();
    }


    // =============================================================
    // BYPASS TOKEN
    // =============================================================

    private boolean isBypassToken(
            String path,
            String method
    ) {

        List<String[]> bypassTokens = Arrays.asList(

                new String[]{
                        "/register",
                        "POST"
                },

                new String[]{
                        "/login",
                        "POST"
                },

                new String[]{
                        "/refresh-token",
                        "POST"
                },

                new String[]{
                        "/send-otp",
                        "POST"
                },

                new String[]{
                        "/verify-otp",
                        "POST"
                },

                new String[]{
                        "/categories",
                        "GET"
                },

                new String[]{
                        "/courses",
                        "GET"
                },

                new String[]{
                        "/course/",
                        "GET"
                },

                new String[]{
                        "/cart/add",
                        "POST"
                },

                new String[]{
                        "/course-detail",
                        "GET"
                },

                new String[]{
                        "/payment/{provider}/ipn",
                        "POST"
                },

                new String[]{
                        "/ipn",
                        "POST"
                },

                new String[]{
                        "/payment/",
                        "GET"
                },

                new String[]{
                        "/public",
                        "GET"
                },

                new String[]{
                        "/reviews",
                        "GET"
                },

                new String[]{
                        "/revenue/top-courses",
                        "GET"
                },

                new String[]{
                        "/revenue-categories",
                        "GET"
                }
        );


        for (String[] bypassToken : bypassTokens) {

            String bypassPath = bypassToken[0];

            String bypassMethod = bypassToken[1];


            // =====================================================
            // PUBLIC COURSE DETAIL
            // GET /course/123
            // GET /api/v1/course/123
            // =====================================================

            if ("/course/".equals(bypassPath)) {

                if (isPublicCourseDetailRequest(
                        path,
                        method
                )) {

                    return true;
                }

                continue;
            }


            // =====================================================
            // KIỂM TRA PATH + METHOD
            // =====================================================

            if (path.contains(bypassPath)
                    && method.equalsIgnoreCase(
                    bypassMethod
            )) {

                return true;
            }
        }


        return false;
    }


    // =============================================================
    // PUBLIC COURSE DETAIL
    // =============================================================

    private boolean isPublicCourseDetailRequest(
            String path,
            String method
    ) {

        if (!"GET".equalsIgnoreCase(method)) {

            return false;
        }


        return path.matches(
                "^/course/\\d+$"
        )
                || path.matches(
                "^"
                        + apiPrefix
                        + "/course/\\d+$"
        );
    }
}