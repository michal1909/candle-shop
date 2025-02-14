package com.example.demo.dto;

import com.example.demo.entity.User;

public class AuthenticationResponse {
    private final String token;
    private final User user;

    public AuthenticationResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public User getUser() {
        return user;
    }
}
