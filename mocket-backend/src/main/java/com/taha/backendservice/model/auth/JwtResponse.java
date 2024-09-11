package com.taha.backendservice.model.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.taha.backendservice.model.db.Position;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JwtResponse {
    private String token;
    private String id;
    private String email;
    private double balance;
    private List<Position> positions;
    private List<String> roles;
    private String status;

    public JwtResponse(String token,
                       String id,
                       String email,
                       double balance,
                       List<Position> positions,
                       List<String> roles) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.balance = balance;
        this.positions = positions;
        this.roles = roles;
    }
}
