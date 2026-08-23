package com.coursedemy.gateway.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class JwtTokenUtil {

    @Value("${jwt.access-expiration-ms:600000}")
    private long accessExpirationMs;

    @Value("${jwt.refresh-expiration-ms:2592000000}")
    private long refreshExpirationMs;

    @Value("${jwt.secretKey:tqg3uhc3x4X+ebUfzqOLnG7yBQhJzhZbg4q27tU8jzE=}")
    private String secretKey;

    private static final String TOKEN_TYPE = "tokenType";
    private static final String ACCESS_TOKEN = "access";
    private static final String REFRESH_TOKEN = "refresh";

    private Key getSignInKey() {
        byte[] bytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(bytes);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = this.extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public boolean isTokenExpired(String token) {
        try {
            Date expirationDate = this.extractClaim(token, Claims::getExpiration);
            return expirationDate.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get(TOKEN_TYPE, String.class));
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public String extractUserId(String token) {
        return extractClaim(token, claims -> String.valueOf(claims.get("id")));
    }

    public boolean validateAccessToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            if (claims == null || isTokenExpired(token)) {
                return false;
            }
            String tokenType = claims.get(TOKEN_TYPE, String.class);
            return ACCESS_TOKEN.equals(tokenType) || tokenType == null;
        } catch (Exception e) {
            return false;
        }
    }
}
