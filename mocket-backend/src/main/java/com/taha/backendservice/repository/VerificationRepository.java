package com.taha.backendservice.repository;

import com.taha.backendservice.model.db.User;

public interface VerificationRepository {
    public int initVerification(User user);
    public int completeVerification(String token);
}
