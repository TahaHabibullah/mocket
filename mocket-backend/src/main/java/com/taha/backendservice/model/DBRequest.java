package com.taha.backendservice.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.taha.backendservice.dto.PositionDTO;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DBRequest {
    private String userId;
    private String posId;
    private int quantity;
    private PositionDTO position;
}