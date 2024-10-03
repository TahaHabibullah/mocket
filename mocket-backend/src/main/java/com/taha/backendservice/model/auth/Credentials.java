package com.taha.backendservice.model.auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class Credentials {
    String token;
    String email;
    String password;
}
