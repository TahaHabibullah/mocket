package com.taha.backendservice.controller;

import com.taha.backendservice.constants.DBConstant;
import com.taha.backendservice.dto.UserDTO;
import com.taha.backendservice.model.DBRequest;
import com.taha.backendservice.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(DBConstant.DB_ROOT_URI)
public class DBController {
    private final static Logger logger = LoggerFactory.getLogger(DBController.class);
    private final UserService userService;

    public DBController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("user")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO postUser(@RequestBody UserDTO userDTO) {
        return userService.save(userDTO);
    }

    @PostMapping("users")
    @ResponseStatus(HttpStatus.CREATED)
    public List<UserDTO> postUsers(@RequestBody List<UserDTO> usersDTO) {
        return userService.saveAll(usersDTO);
    }

    @GetMapping("users")
    public List<UserDTO> getUsers() {
        return userService.findAll();
    }

    @GetMapping("user/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String id) {
        UserDTO userDTO = userService.find(id);
        if (userDTO == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("users/{ids}")
    public List<UserDTO> getUsers(@PathVariable String ids) {
        List<String> listIds = List.of(ids.split(","));
        return userService.findAll(listIds);
    }

    @GetMapping("users/count")
    public Long getCount() {
        return userService.count();
    }

    @DeleteMapping("users")
    public Long deleteUsers() {
        return userService.deleteAll();
    }

    @DeleteMapping("user/{id}")
    public Long deleteUser(@PathVariable String id) {
        return userService.delete(id);
    }

    @DeleteMapping("users/{ids}")
    public Long deleteUsers(@PathVariable String ids) {
        List<String> listIds = List.of(ids.split(","));
        return userService.deleteAll(listIds);
    }

    @PutMapping("user")
    public UserDTO putUser(@RequestBody UserDTO userDTO) {
        return userService.update(userDTO);
    }

    @PutMapping("users")
    public Long putUsers(@RequestBody List<UserDTO> usersDTO) {
        return userService.update(usersDTO);
    }

    @PutMapping("user/addPos")
    public UserDTO putPosition(@RequestBody DBRequest request) {
        return userService.addPosition(request.getUserId(), request.getPosition());
    }
    @PutMapping("user/closePos")
    public UserDTO putClosePosition(@RequestBody DBRequest request) {
        return userService.closePosition(request.getUserId(), request.getPosId(), request.getQuantity());
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public final Exception handleAllExceptions(RuntimeException e) {
        logger.error("Internal server error.", e);
        return e;
    }
}