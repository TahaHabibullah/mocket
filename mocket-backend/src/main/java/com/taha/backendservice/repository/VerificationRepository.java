package com.taha.backendservice.repository;

import com.taha.backendservice.model.db.User;

public interface VerificationRepository {
    public int initVerification(User user);
    public void completeVerification(String token);
    public int initForgotPassword(User user);
    public void resetPassword(String token, String password);
    public int checkToken(String token);
}
