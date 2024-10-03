package com.taha.backendservice.model.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JwtResponse {
    private String token;
    private String id;

    public JwtResponse(String token, String id) {
        this.token = token;
        this.id = id;
    }
}
