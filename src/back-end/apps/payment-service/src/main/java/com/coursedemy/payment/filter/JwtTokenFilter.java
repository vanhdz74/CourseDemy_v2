package com.coursedemy.payment.filter;

import com.coursedemy.payment.entity.RoleEntity;
import com.coursedemy.payment.entity.UserEntity;
import com.coursedemy.payment.util.JwtTokenUtil;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        try {
            final String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                final String token = authHeader.substring(7);
                if (!jwtTokenUtil.isTokenExpired(token) && "access".equals(jwtTokenUtil.extractTokenType(token))) {
                    final String email = jwtTokenUtil.extractEmail(token);
                    if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        Object idObj = jwtTokenUtil.extractClaim(token, claims -> claims.get("id"));
                        Long userId = idObj instanceof Number ? ((Number) idObj).longValue() : (idObj != null ? Long.valueOf(idObj.toString()) : null);
                        String roleName = jwtTokenUtil.extractClaim(token, claims -> claims.get("role", String.class));
                        String username = jwtTokenUtil.extractClaim(token, claims -> claims.get("username", String.class));

                        RoleEntity roleEntity = RoleEntity.builder()
                                .roleName(roleName != null ? roleName : "STUDENT")
                                .build();

                        UserEntity userDetails = UserEntity.builder()
                                .id(userId)
                                .email(email)
                                .username(username)
                                .roleEntity(roleEntity)
                                .isActive(1)
                                .build();

                        UsernamePasswordAuthenticationToken authenticationToken =
                                new UsernamePasswordAuthenticationToken(userDetails, null,
                                        userDetails.getAuthorities());
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    }
                }
            }

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            filterChain.doFilter(request, response);
        }
    }
}
