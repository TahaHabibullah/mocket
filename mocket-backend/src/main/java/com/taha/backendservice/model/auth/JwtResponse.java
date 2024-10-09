package com.taha.backendservice.model.auth;

import lombok.Data;

@Data
public class JwtResponse {
    private String token;

    public JwtResponse(String token) { this.token = token; }
}
