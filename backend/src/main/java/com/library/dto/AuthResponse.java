package com.library.dto;

public class AuthResponse {
    public String token;
    public UserResponse data;

    public AuthResponse(String token, UserResponse data) {
        this.token = token;
        this.data = data;
    }
}
