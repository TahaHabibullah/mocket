package com.taha.backendservice.service;

import com.taha.backendservice.model.auth.LoginRequest;
import com.taha.backendservice.model.auth.SignupRequest;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    public ResponseEntity<?> login(LoginRequest loginRequest);
    public ResponseEntity<?> googleLogin(String token);
    public ResponseEntity<?> register(SignupRequest signupRequest);
    public ResponseEntity<?> verifyEmail(String token);
    public ResponseEntity<?> forgotPassword(String email);
    public ResponseEntity<?> resetPassword(String token, String newPassword);
}
