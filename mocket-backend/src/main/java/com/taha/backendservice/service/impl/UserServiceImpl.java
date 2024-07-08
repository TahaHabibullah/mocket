package com.taha.backendservice.service.impl;

import com.taha.backendservice.dto.PositionDTO;
import com.taha.backendservice.dto.UserDTO;
import com.taha.backendservice.exception.TradeException;
import com.taha.backendservice.model.db.Position;
import com.taha.backendservice.model.price.GraphData;
import com.taha.backendservice.model.quote.QuoteResponse;
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
        logger.info("User info received: " + userDTO.toUser());
        return new UserDTO(userRepository.save(userDTO.toUser()));
    }

    @Override
    public List<UserDTO> saveAll(List<UserDTO> usersDTO) {
        logger.info("Multiple user info received: " + usersDTO.stream().map(UserDTO::toUser).toList());
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
        logger.info("Searching for users with ids=" + ids.toString());
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
        logger.info("Deleting users with ids=" + ids.toString());
        return userRepository.deleteAll(ids);
    }

    @Override
    public long deleteAll() {
        logger.info("Deleting all users");
        return userRepository.deleteAll();
    }

    @Override
    public UserDTO update(UserDTO userDTO) {
        logger.info("Updating user with id=" + userDTO.toUser().getId() + " with info: " + userDTO.toUser());
        return new UserDTO(userRepository.update(userDTO.toUser()));
    }

    @Override
    public long update(List<UserDTO> usersDTO) {
        logger.info("Updating multiple with info: " + usersDTO.stream().map(UserDTO::toUser).toList());
        return userRepository.update(usersDTO.stream().map(UserDTO::toUser).toList());
    }

    @Override
    public UserDTO addPosition(String id, PositionDTO p) {
        logger.info("Adding position to user with id=" + id + " with info: " + p.toPosition());
        return new UserDTO(userRepository.addPosition(id, p.toPosition()));
    }

    @Override
    public UserDTO closePosition(String userId, String symbol, int quantity, double price) {
        logger.info("Closing position of user with id=" + userId + " with info: "
                    + "symbol='" + symbol
                    + "', quantity='" + quantity
                    + "', price='" + price + "'");
        return new UserDTO(userRepository.closePosition(userId, symbol, quantity, price));
    }

    @Override
    public List<Position> getSymPositions(String id, String symbol) {
        logger.info("Retrieving positions from user with id=" + id + " where symbol='" + symbol + "'");
        return userRepository.getSymPositions(id, symbol);
    }

    @Override
    public List<QuoteResponse> getPosQuotes(String id) throws TradeException {
        logger.info("Retrieving quotes for positions from user with id=" + id);
        return userRepository.getPosQuotes(id);
    }

    @Override
    public List<GraphData> getGraphData(String id, String interval, String start_date) throws TradeException {
        return userRepository.getGraphData(id, interval, start_date);
    }
}
