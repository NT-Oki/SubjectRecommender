package org.example.subjectrecommender.util;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.example.subjectrecommender.config.ValueProperties;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final ValueProperties valueProperties;
    private final Key signingKey;

    public JwtUtil(ValueProperties valueProperties) {
        this.valueProperties = valueProperties;
        this.signingKey = Keys.hmacShaKeyFor(valueProperties.getSecret_key().getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String userId, int role) {
        return Jwts.builder()
                .setSubject(userId)
                .claim("role",role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + valueProperties.getTime_token()))
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String extractUserId(String token) {
        return getClaims(token).getSubject();
    }
    public int extractRole(String token) {
        Claims claims = getClaims(token);
        return (Integer) claims.get("role");
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = getClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
