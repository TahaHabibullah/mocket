package com.taha.backendservice.model.auth;

import lombok.Data;
import java.util.Set;

@Data
public class SignupRequest {
    private String email;
    private String password;
    private Set<String> roles;
}
