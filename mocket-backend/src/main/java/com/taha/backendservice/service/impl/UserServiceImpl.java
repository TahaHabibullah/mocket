package com.taha.backendservice.service.impl;

import com.taha.backendservice.controller.DBController;
import com.taha.backendservice.dto.UserDTO;
import com.taha.backendservice.repository.UserRepository;
import com.taha.backendservice.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final static Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository userRepository;
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    @Override
    public UserDTO save(UserDTO userDTO) {
        logger.info("User info received: " + userDTO.toUser().toString());
        return new UserDTO(userRepository.save(userDTO.toUser()));
    }

    @Override
    public List<UserDTO> saveAll(List<UserDTO> usersDTO) {
        logger.info("Multiple user info received: " + usersDTO.stream().map(UserDTO::toUser).toString());
        return usersDTO.stream()
               .map(UserDTO::toUser)
               .peek(userRepository::save)
               .map(UserDTO::new)
               .toList();
    }

    @Override
    public UserDTO find(String id) {
        logger.info("Searching for user with id=" + id);
        return new UserDTO(userRepository.find(id));
    }

    @Override
    public List<UserDTO> findAll(List<String> ids) {
        logger.info("Searching for users with ids=" + ids.stream().toString());
        return userRepository.findAll(ids).stream().map(UserDTO::new).toList();
    }

    @Override
    public List<UserDTO> findAll() {
        logger.info("Searching for all users");
        return userRepository.findAll().stream().map(UserDTO::new).toList();
    }

    @Override
    public long count() {
        logger.info("Getting total user count");
        return userRepository.count();
    }

    @Override
    public long delete(String id) {
        logger.info("Deleting user with id=" + id);
        return userRepository.delete(id);
    }

    @Override
    public long deleteAll(List<String> ids) {
        logger.info("Deleting users with ids=" + ids.stream().toString());
        return userRepository.deleteAll(ids);
    }

    @Override
    public long deleteAll() {
        logger.info("Deleting all users");
        return userRepository.deleteAll();
    }

    @Override
    public UserDTO update(UserDTO userDTO) {
        logger.info("Updating user with id=" + userDTO.toUser().getId() + " with info: " + userDTO.toUser().toString());
        return new UserDTO(userRepository.update(userDTO.toUser()));
    }

    @Override
    public long update(List<UserDTO> usersDTO) {
        logger.info("Updating multiple with info: " + usersDTO.stream().map(UserDTO::toUser).toString());
        return userRepository.update(usersDTO.stream().map(UserDTO::toUser).toList());
    }
}
