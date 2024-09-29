package com.taha.backendservice.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.taha.backendservice.constants.ERole;
import com.taha.backendservice.controller.DBController;
import com.taha.backendservice.model.auth.JwtResponse;
import com.taha.backendservice.model.auth.LoginRequest;
import com.taha.backendservice.model.auth.SignupRequest;
import com.taha.backendservice.model.auth.SocialLoginRequest;
import com.taha.backendservice.model.db.Role;
import com.taha.backendservice.model.db.User;
import com.taha.backendservice.repository.RoleRepository;
import com.taha.backendservice.repository.UserRepository;
import com.taha.backendservice.security.jwt.JwtUtils;
import com.taha.backendservice.security.service.UserDetailsImpl;
import com.taha.backendservice.service.AuthService;
import feign.Response;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class AuthServiceImpl implements AuthService {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    JwtUtils jwtUtils;
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
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId().toString(),
                    userDetails.getEmail(),
                    userDetails.getBalance(),
                    userDetails.getPositions(),
                    roles));
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
    public ResponseEntity<?> googleLogin(SocialLoginRequest loginRequest) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(clientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(loginRequest.getToken());

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();


                User user;
                if (userRepository.existsByEmail(email)) {
                    user = userRepository.findByEmail(email).get();
                } else {
                    user = new User(new ObjectId(), email, null, 10000, new ArrayList<>());
                    Set<Role> roles = new HashSet<>();
                    Role userRole = roleRepository.findByType(ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found"));
                    roles.add(userRole);
                    user.setRoles(roles);
                    userRepository.save(user);
                }

                String jwt = jwtUtils.generateGoogleJwtToken(email);

                return ResponseEntity.ok(new JwtResponse(jwt,
                        user.getId().toString(),
                        user.getEmail(),
                        user.getBalance(),
                        user.getPositions(),
                        user.getRoles().stream().map(
                                        item -> item.getType().toString())
                                .collect(Collectors.toList())));

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
        User user = new User(null, signupRequest.getEmail(),
                encoder.encode(signupRequest.getPassword()), 10000, new ArrayList<>());

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
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }
}
