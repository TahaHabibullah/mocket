package com.taha.backendservice.model.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class SignupRequest {
    @Size(max = 50)
    @Email
    private String email;
    @Size(min = 3, max = 30)
    private String username;
    @Size(min = 8, max = 50)
    private String password;
    private Set<String> roles;
}
