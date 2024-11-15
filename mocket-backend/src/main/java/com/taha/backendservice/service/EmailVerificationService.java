package com.taha.backendservice.service;

import jakarta.mail.MessagingException;

public interface EmailVerificationService {
    public void sendVerification(String to, String token) throws MessagingException;
    public void sendForgotPass(String to, String token) throws MessagingException;
}
