package com.taha.backendservice.repository;

import java.util.List;
import java.util.Optional;

import com.taha.backendservice.exception.TradeException;
import com.taha.backendservice.model.db.Position;
import com.taha.backendservice.model.db.User;
import com.taha.backendservice.model.price.GraphData;
import com.taha.backendservice.model.price.OrderData;
import com.taha.backendservice.model.quote.QuoteResponse;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository {
    User save(User user);
    List<User> saveAll(List<User> users);
    User find(String id);
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Boolean existsByUsername(String username);
    List<User> findAll(List<String> ids);
    List<User> findAll();
    long count();
    long delete(String id);
    long deleteAll(List<String> ids);
    long deleteAll();
    User verifyUser(String id);
    User changePassword(String id, String newPassword);
    User update(User user);
    long update(List<User> users);
    User addPosition(String id, Position p);
    User closePosition(String userId, String symbol, int quantity, double price);
    User updatePosition(String userId, String posId, Position p);
    List<Position> getSymPositions(String id, String symbol);
    List<QuoteResponse> getPosQuotes(String id) throws TradeException;
    List<GraphData> getGraphData(String id, String interval, String start_date) throws TradeException;
    List<OrderData> getOrderHist(String id) throws TradeException;
}
