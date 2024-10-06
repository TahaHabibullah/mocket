package com.taha.backendservice.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.taha.backendservice.constants.ERole;
import com.taha.backendservice.model.auth.JwtResponse;
import com.taha.backendservice.model.auth.LoginRequest;
import com.taha.backendservice.model.auth.SignupRequest;
import com.taha.backendservice.model.db.Role;
import com.taha.backendservice.model.db.User;
import com.taha.backendservice.repository.RoleRepository;
import com.taha.backendservice.repository.UserRepository;
import com.taha.backendservice.repository.VerificationRepository;
import com.taha.backendservice.security.jwt.JwtUtils;
import com.taha.backendservice.security.service.UserDetailsImpl;
import com.taha.backendservice.service.AuthService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class AuthServiceImpl implements AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private VerificationRepository verificationRepository;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private JwtUtils jwtUtils;
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Override
    public ResponseEntity<?> login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            if(!userDetails.isVerified()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email is not yet verified.");
            }
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId().toString()));
        } catch(Exception e) {
            if(e.getMessage() == "Bad credentials") {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password.");
            }
            else if(e.getMessage() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Account doesn't exist.");
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed.");
        }
    }

    @Override
    public ResponseEntity<?> googleLogin(String token) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
                                                                               new GsonFactory())
                    .setAudience(Collections.singletonList(clientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(token);

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();

                User user;
                if (userRepository.existsByEmail(email)) {
                    user = userRepository.findByEmail(email).get();
                } else {
                    user = new User(new ObjectId(),
                                    email,
                                    null,
                                    10000,
                                    new ArrayList<>(),
                                    true);

                    Set<Role> roles = new HashSet<>();
                    Role userRole = roleRepository.findByType(ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found"));
                    roles.add(userRole);
                    user.setRoles(roles);
                    userRepository.save(user);
                }

                String jwt = jwtUtils.generateGoogleJwtToken(email);

                return ResponseEntity.ok(new JwtResponse(jwt, user.getId().toString()));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Google login failed.");
        }
    }

    @Override
    public ResponseEntity<?> register(SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already in use.");
        }

        if(signupRequest.getPassword().length() < 8) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password must be at least 8 characters.");
        }
        User user = new User(new ObjectId(), signupRequest.getEmail(),
                encoder.encode(signupRequest.getPassword()), 10000, new ArrayList<>(), false);

        Set<String> strRoles = signupRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByType(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found"));
            roles.add(userRole);
        }
        else {
            strRoles.forEach(role -> {
                if(role == "admin") {
                    Role adminRole = roleRepository.findByType(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found"));
                    //roles.add(adminRole);
                }
                else {
                    Role userRole = roleRepository.findByType(ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found"));
                    roles.add(userRole);
                }
            });
        }
        user.setRoles(roles);
        int status = verificationRepository.initVerification(user);
        if(status == 1) {
            userRepository.save(user);
            return ResponseEntity.ok("Check email for verification.");
        }
        else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                   .body("Couldn't send email verification.");
        }
    }

    @Override
    public ResponseEntity<?> verifyEmail(String token) {
        int status = verificationRepository.checkToken(token);
        if(status == 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token.");
        }
        else if(status == 2) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token expired.");
        }
        else if(status == -1) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Email verification failed.");
        }

        verificationRepository.completeVerification(token);
        return ResponseEntity.ok("Email verified.");
    }

    @Override
    public ResponseEntity<?> forgotPassword(String email) {
        if (!userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is not in use.");
        }
        User user = userRepository.findByEmail(email).get();

        if(!user.isVerified()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email is not yet verified.");
        }

        int status = verificationRepository.initForgotPassword(user);
        if(status == 1) {
            return ResponseEntity.ok("Check email to reset password.");
        }
        else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Couldn't send reset email.");
        }
    }

    @Override
    public ResponseEntity<?> resetPassword(String token, String newPassword) {
        if(newPassword.length() < 8) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password must be at least 8 characters.");
        }

        String encoded = encoder.encode(newPassword);
        int status = verificationRepository.checkToken(token);
        if(status == 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token.");
        }
        else if(status == 2) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token expired.");
        }
        else if(status == -1) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Password reset failed.");
        }

        verificationRepository.resetPassword(token, encoded);
        return ResponseEntity.ok("Password changed.");
    }

    @Override
    public ResponseEntity<?> checkToken(String token) {
        int status = verificationRepository.checkToken(token);
        if(status == 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token.");
        }
        else if(status == 2) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token expired.");
        }
        else if(status == -1) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unknown error occurred.");
        }
        return ResponseEntity.ok("Valid token.");
    }
}
