package com.taha.backendservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.taha.backendservice.model.db.User;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
public record UserDTO(String id,
                      String email,
                      @JsonIgnore
                      String password,
                      double balance,
                      List<PositionDTO> positions,
                      boolean verified,
                      int failedLoginAttempts,
                      boolean locked,
                      Date lockTime) {

    public UserDTO(User u) {
        this(u.getId() == null ? new ObjectId().toHexString() : u.getId().toHexString(), u.getEmail(),
                u.getPassword(), u.getBalance(), u.getPositions() == null ? new ArrayList<>() :
                u.getPositions().stream().map(PositionDTO::new).toList(), u.isVerified(),
                u.getFailedLoginAttempts(), u.isLocked(), u.getLockTime());
    }

    public User toUser() {
        ObjectId _id = id == null ? new ObjectId() : new ObjectId(id);
        List<PositionDTO> _positions = positions == null ? new ArrayList<>() : this.positions;
        return new User(_id,
                email,
                password,
                balance,
                _positions.stream().map(PositionDTO::toPosition).toList(),
                verified,
                failedLoginAttempts,
                locked,
                lockTime
        );
    }
}

