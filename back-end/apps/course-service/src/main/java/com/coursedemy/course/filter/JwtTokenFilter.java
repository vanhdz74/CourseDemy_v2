package com.coursedemy.course.filter;

import com.coursedemy.course.util.JwtTokenUtil;
import com.coursedemy.course.entity.UserEntity;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter; // kế thừa

import org.springframework.security.core.userdetails.UserDetailsService;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {
    @Value("${api.prefix}")
    private String apiPrefix;

    private final UserDetailsService userDetailsService;
    private final JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, // request hiện tại.
                                    @NonNull HttpServletResponse response, // response hiện tại.
                                    @NonNull FilterChain filterChain) // tiếp tục phần xử lý (controller, filter khác).

        // bắt/propagate IO và Servlet exceptions.
            throws ServletException, IOException {
        try {
            // Ktra request, nếu request “bỏ qua”, không cần kiểm tra JWT → cho đi luôn.
            if (isBypassToken(request)) {
                filterChain.doFilter(request, response);
                return;
            }

            // Ktra respon kèm theo
            final String authHeader = request.getHeader("Authorization");
            // Check header có bị null hay ko có Bearer đầu
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                return;
            }

            // Lấy token
            final String token = authHeader.substring(7);

            // Lấy email token
            final String email = jwtTokenUtil.extractEmail(token);
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserEntity userDetails = (UserEntity) userDetailsService.loadUserByUsername(email);

                // Check email của token và email lấy đc trong đb khi load
                if (jwtTokenUtil.validateAccessToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null,
                                    userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }

            // Tiếp tục doFilter
            filterChain.doFilter(request, response); //enable bypass

        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
        }
    }

    // Xác định request hiện tại có phải isBypassToken
    // kiểm tra xem request hiện tại có nằm trong danh sách “bỏ qua xác thực JWT” không.
    private boolean isBypassToken(@NonNull HttpServletRequest request) {
        final List<Pair<String, String>> bypassTokens = Arrays.asList(
                Pair.of("/register", "POST"),
                Pair.of("/login", "POST"),
                Pair.of("/refresh-token", "POST"),
                Pair.of("/send-otp", "POST"),
                Pair.of("/verify-otp", "POST"),
                Pair.of("/categories", "GET"),
                Pair.of("/courses", "GET"),
                Pair.of("/course/", "GET"),
                Pair.of("/cart/add", "POST"),
                Pair.of("/course-detail", "GET"),
                Pair.of("/api/payment/{provider}/ipn", "POST"),
                Pair.of("/ipn", "POST"),
                Pair.of("/api/payment/", "GET"),
                Pair.of("/public", "GET"),
                Pair.of("/reviews", "GET"),
                Pair.of("/revenue/top-courses", "GET"),
                Pair.of("/revenue-categories", "GET")
//                Pair.of("/", "GET")
//                Pair.of("/upload-len", "POST")
        );

        // first: đường dẫn API
        // second: method HTTP
        for (Pair<String, String> bypassToken : bypassTokens) {
            if ("/course/".equals(bypassToken.getFirst())) {
                if (isPublicCourseDetailRequest(request)) {
                    return true;
                }
                continue;
            }

            if (request.getRequestURI().contains(bypassToken.getFirst()) &&
                    request.getMethod().equals(bypassToken.getSecond())) {
                return true;
            }
        }
        return false;
    }

    private boolean isPublicCourseDetailRequest(HttpServletRequest request) {
        if (!request.getMethod().equals("GET")) {
            return false;
        }

        String uri = request.getRequestURI();
        return uri.matches("^/course/\\d+$") || uri.matches("^" + apiPrefix + "/course/\\d+$");
    }
}
