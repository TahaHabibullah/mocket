package com.taha.backendservice.constants;

public interface AuthConstant {
    public final String AUTH_ROOT_URI = "/auth";
    public final String REGISTER = "/register";
    public final String LOGIN = "/login";
    public final String SOCIAL_LOGIN_GOOGLE = "/social-login/google";
    public final String VERIFY_EMAIL = "/verify-email";
    public final String FORGOT_PASS = "/forgot-password";
    public final String RESET_PASS = "/reset-password";
    public final String VERIFICATION_URL =  "http://localhost:3000/verify-email?token=";
    public final String RESET_PASS_URL =  "http://localhost:3000/reset-password?token=";
}
