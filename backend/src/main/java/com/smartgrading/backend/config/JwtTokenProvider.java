package com.smartgrading.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {
    private final Key key;
    private final long expiration;

    public JwtTokenProvider(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration}") long expiration) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }
    public String createToken(String username) { return Jwts.builder().setSubject(username).setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + expiration)).signWith(key, SignatureAlgorithm.HS256).compact(); }
    public String getUsername(String token) { return claims(token).getSubject(); }
    public boolean isValid(String token) { try { claims(token); return true; } catch (RuntimeException exception) { return false; } }
    private Claims claims(String token) { return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody(); }
}
