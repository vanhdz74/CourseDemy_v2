package com.coursedemy.gateway.filter;

import com.coursedemy.gateway.util.JwtTokenUtil;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenFilter implements WebFilter {

    @Value("${api.prefix:}")
    private String apiPrefix;

    private final JwtTokenUtil jwtTokenUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        String method = request.getMethod() != null ? request.getMethod().name() : "";

        if ("OPTIONS".equalsIgnoreCase(method)) {
            return chain.filter(exchange);
        }

        // 1. Lấy Authorization Header nếu có
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        // 2. Không có token → kiểm tra xem có bypass được không
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            if (isBypassToken(path, method)) {
                return chain.filter(exchange);
            }
            return chain.filter(exchange);
        }

        // 4. Lấy token
        String token = authHeader.substring(7);

        try {
            // 5. Validate JWT token không cần query Database
            if (!jwtTokenUtil.validateAccessToken(token)) {
                return unauthorized(exchange);
            }

            Claims claims = jwtTokenUtil.extractAllClaims(token);
            String email = claims.getSubject();
            if (email == null || email.isBlank()) {
                return unauthorized(exchange);
            }

            String userId = String.valueOf(claims.get("id"));
            String rawRole = claims.get("role") != null ? String.valueOf(claims.get("role")) : "STUDENT";
            String role = rawRole.toUpperCase().replace("ROLE_", "");

            // 6. Gắn header vào request để forward sang các microservice hạ tầng
            ServerHttpRequest mutatedRequest = request.mutate()
                    .header("X-User-Id", userId)
                    .header("X-User-Email", email)
                    .header("X-User-Role", role)
                    .build();

            ServerWebExchange mutatedExchange = exchange.mutate()
                    .request(mutatedRequest)
                    .build();

            // 7. Tạo Authentication với quyền lấy từ JWT claims
            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role));

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    email,
                    null,
                    authorities
            );

            SecurityContext securityContext = new SecurityContextImpl(authentication);

            return chain.filter(mutatedExchange)
                    .contextWrite(ReactiveSecurityContextHolder.withSecurityContext(Mono.just(securityContext)));

        } catch (Exception e) {
            log.error("JWT authentication failed: {}", e.getMessage());
            return unauthorized(exchange);
        }
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    private boolean isBypassToken(String path, String method) {
        List<String[]> bypassTokens = Arrays.asList(
                new String[]{"/register", "POST"},
                new String[]{"/login", "POST"},
                new String[]{"/refresh-token", "POST"},
                new String[]{"/send-otp", "POST"},
                new String[]{"/verify-otp", "POST"},
                new String[]{"/categories", "GET"},
                new String[]{"/course/", "GET"},
                new String[]{"/courses/", "GET"},
                new String[]{"/category", "GET"},
                new String[]{"/payment/", "GET"},
                new String[]{"/public", "GET"},
                new String[]{"/reviews", "GET"},
                new String[]{"/revenue/top-courses", "GET"},
                new String[]{"/revenue-categories", "GET"},
                new String[]{"/lessons/", "GET"},
                new String[]{"/sublessons/", "GET"},
                new String[]{"/sublesson/", "GET"},
                new String[]{"/lesson/", "GET"}
        );

        for (String[] bypassToken : bypassTokens) {
            String bypassPath = bypassToken[0];
            String bypassMethod = bypassToken[1];

            if (path.contains(bypassPath) && method.equalsIgnoreCase(bypassMethod)) {
                return true;
            }
        }

        return false;
    }
}