package com.taha.backendservice.controller;

import com.taha.backendservice.constants.DBConstant;
import com.taha.backendservice.dto.UserDTO;
import com.taha.backendservice.exception.TradeException;
import com.taha.backendservice.model.DBRequest;
import com.taha.backendservice.model.db.Position;
import com.taha.backendservice.model.price.GraphData;
import com.taha.backendservice.model.price.OrderData;
import com.taha.backendservice.model.quote.QuoteResponse;
import com.taha.backendservice.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(DBConstant.DB_ROOT_URI)
public class DBController {
    private final static Logger logger = LoggerFactory.getLogger(DBController.class);
    private final UserService userService;

    public DBController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(DBConstant.USER)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public UserDTO postUser(@RequestBody UserDTO userDTO) {
        return userService.save(userDTO);
    }

    @PostMapping(DBConstant.USERS)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDTO> postUsers(@RequestBody List<UserDTO> usersDTO) {
        return userService.saveAll(usersDTO);
    }

    @GetMapping(DBConstant.USERS)
    public List<UserDTO> getUsers() {
        return userService.findAll();
    }

    @GetMapping(DBConstant.GET_USER)
    public ResponseEntity<UserDTO> getUser(@PathVariable String id) {
        UserDTO userDTO = userService.find(id);
        if (userDTO == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping(DBConstant.GET_USERS)
    public List<UserDTO> getUsers(@PathVariable String ids) {
        List<String> listIds = List.of(ids.split(","));
        return userService.findAll(listIds);
    }

    @GetMapping(DBConstant.GET_COUNT)
    @PreAuthorize("hasRole('ADMIN')")
    public Long getCount() {
        return userService.count();
    }

    @GetMapping(DBConstant.GET_POS)
    public List<Position> getSymPositions(@RequestParam String id, @RequestParam String symbol) {
        return userService.getSymPositions(id, symbol);
    }

    @GetMapping(DBConstant.GET_QUOTES)
    public List<QuoteResponse> getPosQuotes(@RequestParam String id) throws TradeException {
        return userService.getPosQuotes(id);
    }

    @GetMapping(DBConstant.GET_GRAPH)
    public List<GraphData> getGraphData(@RequestParam String id,
                                        @RequestParam String interval,
                                        @RequestParam String start_date) throws TradeException {
        return userService.getGraphData(id, interval, start_date);
    }

    @GetMapping(DBConstant.GET_HIST)
    public List<List<OrderData>> getOrderHist(@RequestParam String id) throws TradeException {
        return userService.getOrderHist(id);
    }

    @DeleteMapping(DBConstant.USER)
    @PreAuthorize("hasRole('ADMIN')")
    public Long deleteUsers() {
        return userService.deleteAll();
    }

    @DeleteMapping(DBConstant.GET_USER)
    @PreAuthorize("hasRole('ADMIN')")
    public Long deleteUser(@PathVariable String id) {
        return userService.delete(id);
    }

    @DeleteMapping(DBConstant.GET_USERS)
    @PreAuthorize("hasRole('ADMIN')")
    public Long deleteUsers(@PathVariable String ids) {
        List<String> listIds = List.of(ids.split(","));
        return userService.deleteAll(listIds);
    }

    @PutMapping(DBConstant.USER)
    @PreAuthorize("hasRole('ADMIN')")
    public UserDTO putUser(@RequestBody UserDTO userDTO) {
        return userService.update(userDTO);
    }

    @PutMapping(DBConstant.USERS)
    @PreAuthorize("hasRole('ADMIN')")
    public Long putUsers(@RequestBody List<UserDTO> usersDTO) {
        return userService.update(usersDTO);
    }

    @PutMapping(DBConstant.PUT_ADD)
    public UserDTO putPosition(@RequestBody DBRequest request) {
        return userService.addPosition(request.getUserId(), request.getPosition());
    }
    @PutMapping(DBConstant.PUT_CLOSE)
    public UserDTO putClosePosition(@RequestBody DBRequest request) {
        return userService.closePosition(request.getUserId(),
                                         request.getSymbol(),
                                         request.getQuantity(),
                                         request.getPrice());
    }

    @PutMapping(DBConstant.PUT_UPDATE)
    public UserDTO putUpdatePosition(@RequestBody DBRequest request) {
        return userService.updatePosition(request.getUserId(),
               request.getPosId(),
               request.getPosition());
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public final Exception handleAllExceptions(RuntimeException e) {
        logger.error("Internal server error.", e);
        return e;
    }
}
