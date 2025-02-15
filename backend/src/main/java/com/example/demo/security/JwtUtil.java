package com.example.demo.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @PostConstruct
    private void init() {
        if (SECRET_KEY == null || SECRET_KEY.isEmpty()) {
            SECRET_KEY = generateSecretKey();
            // Zapisac klucz do application.properties
            System.out.println("Wygenerowano nowy klucz JWT: " + SECRET_KEY);
        }
    }

    private String generateSecretKey() {
        byte[] secretBytes = new byte[64]; // 512 bitów
        new java.security.SecureRandom().nextBytes(secretBytes);
        return Base64.getEncoder().encodeToString(secretBytes);
    }

    public String generateToken(String email, String name, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("name", name);
        claims.put("email", email);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(name)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 dzień
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("email", String.class);
    }

    public boolean validateToken(String token, String username) {
        String extractedName = extractEmail(token);
//        System.out.println("Nazwa z tokenu: " + extractedName);
//        System.out.println("Nazwa z bazy danych: " + username);
        boolean isValid = username.equals(extractedName) && !isTokenExpired(token);
        System.out.println("Czy token jest ważny: " + isValid);

        return isValid;
    }

    private boolean isTokenExpired(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getBody()
                .getExpiration()
                .before(new Date());
    }
}
