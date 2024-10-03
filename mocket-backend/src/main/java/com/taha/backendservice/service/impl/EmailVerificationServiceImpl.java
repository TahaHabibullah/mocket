package com.taha.backendservice.service.impl;

import com.taha.backendservice.constants.AuthConstant;
import com.taha.backendservice.service.EmailVerificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailVerificationServiceImpl implements EmailVerificationService {

    @Autowired
    private JavaMailSender mailSender;
    @Value("${mocket.verification.email}")
    private String fromEmail;

    private static final Logger logger = LoggerFactory.getLogger(EmailVerificationServiceImpl.class);

    @Override
    public void sendVerification(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        String verificationUrl = AuthConstant.VERIFICATION_URL + token;

        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Mocket - Verify your email address");
        message.setText("Click the following link to verify your email: " + verificationUrl);

        mailSender.send(message);
        logger.info("Verification email sent to: " + to);
    }

    @Override
    public void sendForgotPass(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        String verificationUrl = AuthConstant.RESET_PASS_URL + token;

        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Mocket - Reset forgotten password");
        message.setText("Click the following link to reset your password: " + verificationUrl);

        mailSender.send(message);
        logger.info("Password reset email sent to: " + to);
    }
}
