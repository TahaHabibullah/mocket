package com.taha.backendservice.service;

public interface EmailVerificationService {
    public void sendVerification(String to, String token);
}
