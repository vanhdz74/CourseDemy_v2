package com.vanh.CourseWeb.components;

import com.vanh.CourseWeb.entity.UserEntity;
import com.vanh.CourseWeb.exception.InvalidParamException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;


import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class JwtTokenUtil {
    @Value("${jwt.expiration}")
    private int expiration; // save to an environment variable

    @Value("${jwt.secretKey}")
    private String secretKey; // khoá bí mật

    public String generateToken(UserEntity userEntity) throws InvalidParamException {
        // properties => claims
        Map<String, Object> claims = new HashMap<>();

        // this.generateSecretKey();
        // lấy các trường gửi qua token
        claims.put("id", userEntity.getId());
        claims.put("email", userEntity.getEmail());
        claims.put("role", userEntity.getRoleEntity().getRoleName());
        claims.put("username", userEntity.getUsername());

        try {
            // Sinh token
            String token = Jwts.builder()
                    .setClaims(claims) // payload
                    .setSubject(userEntity.getEmail()) // set subject

                    // System.currentTimeMillis(): thời gian đang đăng nhập - tính mls
                    .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000L)) // cấp thời gian: 30 ngày

                    // chữ ký
                    .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                    .compact();
            return token;
        } catch (Exception e) {
            // you can "inject" Logger, instead System.out.println
            throw new InvalidParamException("Cannot create jwt token, error: " + e.getMessage());
        }
    }

    // Lấy key
    private Key getSignInKey() {
        byte[] bytes = Decoders.BASE64.decode(secretKey);
        //Keys.hmacShaKeyFor(Decoders.BASE64.decode("TaqlmGv1iEDMRiFp/pHuID1+T84IABfuA0xXh4GhiUI="));
//        String key = Base64.getEncoder()
//                .encodeToString(Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded());
//        System.out.println(secretKey);
        return Keys.hmacShaKeyFor(bytes);
    }

    //
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

    // check expiration
    public boolean isTokenExpired(String token) {
        Date expirationDate = this.extractClaim(token, Claims::getExpiration);
        return expirationDate.before(new Date()); // hạn nó là trước
    }

    // Xác thực email trong token
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject); // Lấy value thông qua key
    }

    // Check
    public boolean validateToken(String token, UserEntity userDetails) {
        String email = extractEmail(token);
        // check 2 email giống nhau và chưa hết hạn token
        // email token và email tìm được khi load
        return (email.equals(userDetails.getEmail())) && !isTokenExpired(token); //check hạn của token
    }


}
