package com.taha.backendservice.controller;

import com.taha.backendservice.constants.AuthConstant;
import com.taha.backendservice.model.auth.LoginRequest;
import com.taha.backendservice.model.auth.SignupRequest;
import com.taha.backendservice.model.auth.Credentials;
import com.taha.backendservice.service.AuthService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> authGoogleUser(@Valid @RequestBody Credentials credentials) {
        return authService.googleLogin(credentials.getToken());
    }

    @PostMapping(AuthConstant.REGISTER)
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        return authService.register(signUpRequest);
    }

    @PutMapping(AuthConstant.VERIFY_EMAIL)
    public ResponseEntity<?> verifyEmail(@RequestBody Credentials credentials) {
        return authService.verifyEmail(credentials.getToken());
    }

    @PostMapping(AuthConstant.FORGOT_PASS)
    public ResponseEntity<?> forgotPassword(@RequestBody Credentials credentials) {
        return authService.forgotPassword(credentials.getEmail());
    }

    @PutMapping(AuthConstant.RESET_PASS)
    public ResponseEntity<?> resetPassword(@RequestBody Credentials credentials) {
        return authService.resetPassword(credentials.getToken(), credentials.getPassword());
    }

    @PostMapping(AuthConstant.CHECK_TOKEN)
    public ResponseEntity<?> checkToken(@RequestBody Credentials credentials) {
        return authService.checkToken(credentials.getToken());
    }
}