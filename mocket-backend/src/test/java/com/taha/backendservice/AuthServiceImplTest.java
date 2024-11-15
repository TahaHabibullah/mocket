package com.taha.backendservice;

import com.taha.backendservice.model.auth.JwtResponse;
import com.taha.backendservice.model.auth.LoginRequest;
import com.taha.backendservice.model.auth.SignupRequest;
import com.taha.backendservice.model.db.Role;
import com.taha.backendservice.model.db.User;
import com.taha.backendservice.repository.RoleRepository;
import com.taha.backendservice.repository.UserRepository;
import com.taha.backendservice.repository.VerificationRepository;
import com.taha.backendservice.security.EncryptionUtils;
import com.taha.backendservice.security.jwt.JwtUtils;
import com.taha.backendservice.security.service.UserDetailsImpl;
import com.taha.backendservice.service.impl.AuthServiceImpl;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.when;

public class AuthServiceImplTest {

    @InjectMocks
    private AuthServiceImpl authService;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private Authentication authentication;
    @Mock
    private UserRepository userRepository;
    @Mock
    private UserDetailsImpl userDetails;
    @Mock
    private VerificationRepository verificationRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private JwtUtils jwtUtils;
    @Mock
    private User user;
    @Mock
    private EncryptionUtils encryptionUtils;
    @Mock
    private PasswordEncoder encoder;

    @BeforeEach
    void init() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testLogin() {
        JwtResponse jwtResponse = new JwtResponse("test");
        when(userRepository.checkUserStatus(any())).thenReturn(1);
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.isVerified()).thenReturn(true);
        when(userDetails.getId()).thenReturn(new ObjectId("669c943e6e45b63f43d7add8"));
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("test");
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("testing");
        ResponseEntity<?> response = authService.login(loginRequest);
        JwtResponse result = (JwtResponse) response.getBody();
        assertEquals(result.getToken(), jwtResponse.getToken());
    }

    @Test
    void testLoginNoAccount() {
        String loginResponse = "Account doesn't exist.";
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("testing");
        when(userRepository.checkUserStatus(any())).thenReturn(-1);
        ResponseEntity<?> response = authService.login(loginRequest);
        assertEquals(response.getBody(), loginResponse);
    }

    @Test
    void testLoginAccountLocked() {
        String loginResponse = "Account currently locked. Try again later.";
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("testing");
        when(userRepository.checkUserStatus(any())).thenReturn(0);
        ResponseEntity<?> response = authService.login(loginRequest);
        assertEquals(response.getBody(), loginResponse);
    }

    @Test
    void testLoginUseGoogle() {
        String loginResponse = "Account must log in using Google.";
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("testing");
        when(userRepository.checkUserStatus(any())).thenReturn(2);
        ResponseEntity<?> response = authService.login(loginRequest);
        assertEquals(response.getBody(), loginResponse);
    }

    @Test
    void testLoginNotVerified() {
        String loginResponse = "Email is not yet verified.";
        when(userRepository.checkUserStatus(any())).thenReturn(1);
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.isVerified()).thenReturn(false);
        when(userDetails.getId()).thenReturn(new ObjectId("669c943e6e45b63f43d7add8"));
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("test");
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("testing");
        ResponseEntity<?> response = authService.login(loginRequest);
        assertEquals(response.getBody(), loginResponse);
    }

    @Test
    void testLoginExceptionIncorrectPassword() {
        String loginResponse = "Incorrect password.";
        when(userRepository.checkUserStatus(any())).thenReturn(1);
        given(authenticationManager.authenticate(any())).willAnswer(
                invocationOnMock -> { throw new Exception("Bad credentials"); });
        when(userRepository.incrementLoginFails(any())).thenReturn(user);
        when(user.isLocked()).thenReturn(false);
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("testing");
        ResponseEntity<?> response = authService.login(loginRequest);
        assertEquals(response.getBody(), loginResponse);
    }

    @Test
    void testLoginExceptionAccountLocked() {
        String loginResponse = "Too many failed attempts. Account locked.";
        when(userRepository.checkUserStatus(any())).thenReturn(1);
        given(authenticationManager.authenticate(any())).willAnswer(
                invocationOnMock -> { throw new Exception("Bad credentials"); });
        when(userRepository.incrementLoginFails(any())).thenReturn(user);
        when(user.isLocked()).thenReturn(true);
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("testing");
        ResponseEntity<?> response = authService.login(loginRequest);
        assertEquals(response.getBody(), loginResponse);
    }

    @Test
    void testLoginExceptionNoAccount() {
        String loginResponse = "Account doesn't exist.";
        when(userRepository.checkUserStatus(any())).thenReturn(1);
        given(authenticationManager.authenticate(any())).willAnswer(
                invocationOnMock -> { throw new Exception(); });
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("testing");
        ResponseEntity<?> response = authService.login(loginRequest);
        assertEquals(response.getBody(), loginResponse);
    }

    @Test
    void testLoginExceptionServerError() {
        String loginResponse = "Login failed.";
        when(userRepository.checkUserStatus(any())).thenReturn(1);
        given(authenticationManager.authenticate(any())).willAnswer(
                invocationOnMock -> { throw new Exception("Other error"); });
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("testing");
        ResponseEntity<?> response = authService.login(loginRequest);
        assertEquals(response.getBody(), loginResponse);
    }

    @Test
    void testRegister() {
        String registerResponse = "Check email for verification.";
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@test.com");
        signupRequest.setPassword("testing1");
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(encryptionUtils.encrypt(any())).thenReturn("test@test.com");
        when(encoder.encode(any())).thenReturn("testing1");
        when(roleRepository.findByType(any())).thenReturn(Optional.of(new Role()));
        when(verificationRepository.initVerification(any())).thenReturn(1);
        ResponseEntity<?> response = authService.register(signupRequest);
        assertEquals(response.getBody(), registerResponse);
    }

    @Test
    void testRegisterAccountExists() {
        String registerResponse = "Email is already in use.";
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@test.com");
        signupRequest.setPassword("testing1");
        when(userRepository.existsByEmail(any())).thenReturn(true);
        ResponseEntity<?> response = authService.register(signupRequest);
        assertEquals(response.getBody(), registerResponse);
    }

    @Test
    void testRegisterBadPassword() {
        String registerResponse = "Password must be 8-30 characters long.";
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@test.com");
        signupRequest.setPassword("test");
        when(userRepository.existsByEmail(any())).thenReturn(false);
        ResponseEntity<?> response = authService.register(signupRequest);
        assertEquals(response.getBody(), registerResponse);
    }

    @Test
    void testRegisterCantVerify() {
        String registerResponse = "Couldn't send email verification.";
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@test.com");
        signupRequest.setPassword("testing1");
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(encryptionUtils.encrypt(any())).thenReturn("test@test.com");
        when(encoder.encode(any())).thenReturn("testing1");
        when(roleRepository.findByType(any())).thenReturn(Optional.of(new Role()));
        when(verificationRepository.initVerification(any())).thenReturn(0);
        ResponseEntity<?> response = authService.register(signupRequest);
        assertEquals(response.getBody(), registerResponse);
    }

    @Test
    void testVerifyEmail() {
        String verifyEmailResponse = "Email verified.";
        when(verificationRepository.checkToken(any())).thenReturn(1);
        ResponseEntity<?> response = authService.verifyEmail("test");
        assertEquals(response.getBody(), verifyEmailResponse);
    }

    @Test
    void testVerifyEmailInvalidToken() {
        String verifyEmailResponse = "Invalid token.";
        when(verificationRepository.checkToken(any())).thenReturn(0);
        ResponseEntity<?> response = authService.verifyEmail("test");
        assertEquals(response.getBody(), verifyEmailResponse);
    }

    @Test
    void testVerifyEmailExpiredToken() {
        String verifyEmailResponse = "Token expired.";
        when(verificationRepository.checkToken(any())).thenReturn(2);
        ResponseEntity<?> response = authService.verifyEmail("test");
        assertEquals(response.getBody(), verifyEmailResponse);
    }

    @Test
    void testVerifyEmailVerificationFailed() {
        String verifyEmailResponse = "Email verification failed.";
        when(verificationRepository.checkToken(any())).thenReturn(-1);
        ResponseEntity<?> response = authService.verifyEmail("test");
        assertEquals(response.getBody(), verifyEmailResponse);
    }

    @Test
    void testForgotPassword() {
        String forgotPasswordResponse = "Check email to reset password.";
        when(userRepository.existsByEmail(any())).thenReturn(true);
        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));
        when(user.isVerified()).thenReturn(true);
        when(user.getPassword()).thenReturn("test");
        when(verificationRepository.initForgotPassword(any())).thenReturn(1);
        ResponseEntity<?> response = authService.forgotPassword("test");
        assertEquals(response.getBody(), forgotPasswordResponse);
    }

    @Test
    void testForgotPasswordNoAccount() {
        String forgotPasswordResponse = "Account doesn't exist.";
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));
        when(user.isVerified()).thenReturn(true);
        when(user.getPassword()).thenReturn("test");
        when(verificationRepository.initForgotPassword(any())).thenReturn(1);
        ResponseEntity<?> response = authService.forgotPassword("test");
        assertEquals(response.getBody(), forgotPasswordResponse);
    }

    @Test
    void testForgotPasswordNotVerified() {
        String forgotPasswordResponse = "Email is not yet verified.";
        when(userRepository.existsByEmail(any())).thenReturn(true);
        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));
        when(user.isVerified()).thenReturn(false);
        when(user.getPassword()).thenReturn("test");
        when(verificationRepository.initForgotPassword(any())).thenReturn(1);
        ResponseEntity<?> response = authService.forgotPassword("test");
        assertEquals(response.getBody(), forgotPasswordResponse);
    }

    @Test
    void testForgotPasswordGoogleAccount() {
        String forgotPasswordResponse = "Account must log in using Google.";
        when(userRepository.existsByEmail(any())).thenReturn(true);
        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));
        when(user.isVerified()).thenReturn(true);
        when(user.getPassword()).thenReturn(null);
        when(verificationRepository.initForgotPassword(any())).thenReturn(1);
        ResponseEntity<?> response = authService.forgotPassword("test");
        assertEquals(response.getBody(), forgotPasswordResponse);
    }

    @Test
    void testForgotPasswordCantSendEmail() {
        String forgotPasswordResponse = "Couldn't send reset email.";
        when(userRepository.existsByEmail(any())).thenReturn(true);
        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));
        when(user.isVerified()).thenReturn(true);
        when(user.getPassword()).thenReturn("test");
        when(verificationRepository.initForgotPassword(any())).thenReturn(-1);
        ResponseEntity<?> response = authService.forgotPassword("test");
        assertEquals(response.getBody(), forgotPasswordResponse);
    }

    @Test
    void testResetPassword() {
        String resetPasswordResponse = "Password changed.";
        when(encoder.encode(any())).thenReturn("testing1");
        when(verificationRepository.checkToken(any())).thenReturn(1);
        ResponseEntity<?> response = authService.resetPassword("token", "testing1");
        assertEquals(response.getBody(), resetPasswordResponse);
    }

    @Test
    void testResetPasswordBadPassword() {
        String resetPasswordResponse = "Password must be 8-30 characters long.";
        ResponseEntity<?> response = authService.resetPassword("token", "test");
        assertEquals(response.getBody(), resetPasswordResponse);
    }

    @Test
    void testResetPasswordInvalidToken() {
        String resetPasswordResponse = "Invalid token.";
        when(encoder.encode(any())).thenReturn("testing1");
        when(verificationRepository.checkToken(any())).thenReturn(0);
        ResponseEntity<?> response = authService.resetPassword("token", "testing1");
        assertEquals(response.getBody(), resetPasswordResponse);
    }

    @Test
    void testResetPasswordExpiredToken() {
        String resetPasswordResponse = "Token expired.";
        when(encoder.encode(any())).thenReturn("testing1");
        when(verificationRepository.checkToken(any())).thenReturn(2);
        ResponseEntity<?> response = authService.resetPassword("token", "testing1");
        assertEquals(response.getBody(), resetPasswordResponse);
    }

    @Test
    void testResetPasswordResetFailed() {
        String resetPasswordResponse = "Password reset failed.";
        when(encoder.encode(any())).thenReturn("testing1");
        when(verificationRepository.checkToken(any())).thenReturn(-1);
        ResponseEntity<?> response = authService.resetPassword("token", "testing1");
        assertEquals(response.getBody(), resetPasswordResponse);
    }

    @Test
    void testCheckToken() {
        String checkTokenResponse = "Valid token.";
        when(verificationRepository.checkToken(any())).thenReturn(1);
        ResponseEntity<?> response = authService.checkToken("test");
        assertEquals(response.getBody(), checkTokenResponse);
    }

    @Test
    void testCheckTokenInvalidToken() {
        String checkTokenResponse = "Invalid token.";
        when(verificationRepository.checkToken(any())).thenReturn(0);
        ResponseEntity<?> response = authService.checkToken("test");
        assertEquals(response.getBody(), checkTokenResponse);
    }

    @Test
    void testCheckTokenExpiredToken() {
        String checkTokenResponse = "Token expired.";
        when(verificationRepository.checkToken(any())).thenReturn(2);
        ResponseEntity<?> response = authService.checkToken("test");
        assertEquals(response.getBody(), checkTokenResponse);
    }

    @Test
    void testCheckTokenError() {
        String checkTokenResponse = "Unknown error occurred.";
        when(verificationRepository.checkToken(any())).thenReturn(-1);
        ResponseEntity<?> response = authService.checkToken("test");
        assertEquals(response.getBody(), checkTokenResponse);
    }
}
