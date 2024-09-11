package com.taha.backendservice.service;

import com.taha.backendservice.model.auth.JwtResponse;
import com.taha.backendservice.model.auth.LoginRequest;
import com.taha.backendservice.model.auth.SignupRequest;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    public JwtResponse login(LoginRequest loginRequest);
    public ResponseEntity<?> register(SignupRequest signupRequest);
}
