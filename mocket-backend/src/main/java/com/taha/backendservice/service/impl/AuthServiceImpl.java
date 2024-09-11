package com.taha.backendservice.service.impl;

import com.taha.backendservice.constants.ERole;
import com.taha.backendservice.controller.DBController;
import com.taha.backendservice.model.auth.JwtResponse;
import com.taha.backendservice.model.auth.LoginRequest;
import com.taha.backendservice.model.auth.SignupRequest;
import com.taha.backendservice.model.db.Role;
import com.taha.backendservice.model.db.User;
import com.taha.backendservice.repository.RoleRepository;
import com.taha.backendservice.repository.UserRepository;
import com.taha.backendservice.security.jwt.JwtUtils;
import com.taha.backendservice.security.service.UserDetailsImpl;
import com.taha.backendservice.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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

    @Override
    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return new JwtResponse(jwt,
                userDetails.getId().toString(),
                userDetails.getEmail(),
                userDetails.getBalance(),
                userDetails.getPositions(),
                roles);
    }

    @Override
    public ResponseEntity<?> register(SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.ok("Error: Email is already in use");
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
