package com.taha.backendservice.service.impl;

import com.taha.backendservice.constants.AuthConstant;
import com.taha.backendservice.service.EmailVerificationService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailVerificationServiceImpl implements EmailVerificationService {

    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private TemplateEngine templateEngine;
    @Value("${mocket.verification.email}")
    private String fromEmail;

    private static final Logger logger = LoggerFactory.getLogger(EmailVerificationServiceImpl.class);

    /*@Override
    public void sendVerification(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        String verificationUrl = AuthConstant.VERIFICATION_URL + token;

        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Mocket - Verify your email address");
        message.setText("Click the following link to verify your email: " + verificationUrl);

        mailSender.send(message);
        logger.info("Verification email sent to: " + to);
    }*/

    @Override
    public void sendVerification(String to, String token) throws MessagingException {
        String verificationUrl = AuthConstant.VERIFICATION_URL + token;
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                StandardCharsets.UTF_8.name());

        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("url", verificationUrl);

        helper.setTo(to);
        helper.setSubject("Mocket - Verify your email address");
        helper.setFrom(fromEmail);

        Context context = new Context();
        context.setVariables(templateModel);
        String htmlContent = templateEngine.process("verification", context);

        helper.setText(htmlContent, true);
        ClassPathResource imageResource = new ClassPathResource("templates/images/mocket2b.png");
        helper.addInline("mocketLogo", imageResource);

        mailSender.send(message);
    }

    @Override
    public void sendForgotPass(String to, String token) throws MessagingException {
        String resetUrl = AuthConstant.RESET_PASS_URL + token;
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                StandardCharsets.UTF_8.name());

        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("url", resetUrl);

        helper.setTo(to);
        helper.setSubject("Mocket - Reset your password");
        helper.setFrom(fromEmail);

        Context context = new Context();
        context.setVariables(templateModel);
        String htmlContent = templateEngine.process("resetpassword", context);

        helper.setText(htmlContent, true);
        ClassPathResource imageResource = new ClassPathResource("templates/images/mocket2b.png");
        helper.addInline("mocketLogo", imageResource);

        mailSender.send(message);
    }
}
