package com.taha.backendservice.service;

import com.taha.backendservice.dto.PositionDTO;
import com.taha.backendservice.dto.UserDTO;
import java.util.List;

public interface UserService {
    UserDTO save(UserDTO userDTO);
    List<UserDTO> saveAll(List<UserDTO> usersDTO);
    UserDTO find(String id);
    List<UserDTO> findAll(List<String> ids);
    List<UserDTO> findAll();
    long count();
    long delete(String id);
    long deleteAll(List<String> ids);
    long deleteAll();
    UserDTO update(UserDTO userDTO);
    long update(List<UserDTO> usersDTO);
    UserDTO addPosition(String id, PositionDTO p);
    UserDTO closePosition(String userId, String symbol, int quantity, double price);
    List<PositionDTO> getSymPositions(String id, String symbol);
}
