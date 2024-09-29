package com.taha.backendservice.controller;

import com.taha.backendservice.constants.AuthConstant;
import com.taha.backendservice.model.auth.JwtResponse;
import com.taha.backendservice.model.auth.LoginRequest;
import com.taha.backendservice.model.auth.SignupRequest;
import com.taha.backendservice.model.auth.SocialLoginRequest;
import com.taha.backendservice.service.AuthService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.GeneralSecurityException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(AuthConstant.AUTH_ROOT_URI)
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping(AuthConstant.LOGIN)
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @PostMapping(AuthConstant.SOCIAL_LOGIN_GOOGLE)
    public ResponseEntity<?> authGoogleUser(@Valid @RequestBody SocialLoginRequest loginRequest) {
        return authService.googleLogin(loginRequest);
    }

    @PostMapping(AuthConstant.REGISTER)
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        return authService.register(signUpRequest);
    }
}