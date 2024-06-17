package com.taha.backendservice.dto;

import com.taha.backendservice.model.db.User;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;
public record UserDTO(String id,
                      String email,
                      double balance,
                      List<PositionDTO> positions) {

    public UserDTO(User u) {
        this(u.getId() == null ? new ObjectId().toHexString() : u.getId().toHexString(), u.getEmail(),
             u.getBalance(), u.getPositions() == null ? new ArrayList<>() : u.getPositions().stream().map(PositionDTO::new).toList());
    }

    public User toUser() {
        ObjectId _id = id == null ? new ObjectId() : new ObjectId(id);
        List<PositionDTO> _positions = positions == null ? new ArrayList<>() : this.positions;
        return new User(_id, email, balance, _positions.stream().map(PositionDTO::toPosition).toList());
    }
}

