package com.taha.backendservice.service;

import com.taha.backendservice.model.auth.LoginRequest;
import com.taha.backendservice.model.auth.SignupRequest;
import com.taha.backendservice.model.auth.SocialLoginRequest;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    public ResponseEntity<?> login(LoginRequest loginRequest);
    public ResponseEntity<?> googleLogin(SocialLoginRequest loginRequest);
    public ResponseEntity<?> register(SignupRequest signupRequest);
}
