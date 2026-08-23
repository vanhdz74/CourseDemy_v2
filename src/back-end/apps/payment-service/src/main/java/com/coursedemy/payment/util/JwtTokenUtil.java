package com.coursedemy.payment.util;

import com.coursedemy.payment.entity.UserEntity;
import com.coursedemy.common.exception.InvalidParamException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
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

    public String generateToken(UserEntity userEntity) throws InvalidParamException {
        return generateAccessToken(userEntity);
    }

    public String generateAccessToken(UserEntity userEntity) throws InvalidParamException {
        return generateToken(userEntity, ACCESS_TOKEN, accessExpirationMs);
    }

    public String generateRefreshToken(UserEntity userEntity) throws InvalidParamException {
        return generateToken(userEntity, REFRESH_TOKEN, refreshExpirationMs);
    }

    public long getAccessExpirationMs() {
        return accessExpirationMs;
    }

    private String generateToken(UserEntity userEntity, String tokenType, long expirationMs) throws InvalidParamException {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", userEntity.getId());
        claims.put("email", userEntity.getEmail());
        claims.put("role", userEntity.getRoleEntity() != null ? userEntity.getRoleEntity().getRoleName() : "STUDENT");
        claims.put("username", userEntity.getUsername());
        claims.put(TOKEN_TYPE, tokenType);

        try {
            return Jwts.builder()
                    .setClaims(claims)
                    .setSubject(userEntity.getEmail())
                    .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                    .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            throw new InvalidParamException("Cannot create jwt token, error: " + e.getMessage());
        }
    }

    private Key getSignInKey() {
        byte[] bytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(bytes);
    }

    private Claims extractAllClaims(String token) {
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
        Date expirationDate = this.extractClaim(token, Claims::getExpiration);
        return expirationDate.before(new Date());
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get(TOKEN_TYPE, String.class));
    }

    public boolean validateToken(String token, UserEntity userDetails) {
        String email = extractEmail(token);
        return (email.equals(userDetails.getEmail())) && !isTokenExpired(token);
    }

    public boolean validateAccessToken(String token, UserEntity userDetails) {
        return validateToken(token, userDetails) && ACCESS_TOKEN.equals(extractTokenType(token));
    }

    public boolean validateRefreshToken(String token, UserEntity userDetails) {
        return validateToken(token, userDetails) && REFRESH_TOKEN.equals(extractTokenType(token));
    }
}
