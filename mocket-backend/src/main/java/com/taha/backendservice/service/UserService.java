package com.taha.backendservice.service;

import com.taha.backendservice.dto.PositionDTO;
import com.taha.backendservice.dto.UserDTO;
import com.taha.backendservice.exception.TradeException;
import com.taha.backendservice.model.db.Position;
import com.taha.backendservice.model.price.GraphData;
import com.taha.backendservice.model.price.OrderData;
import com.taha.backendservice.model.quote.QuoteResponse;

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
    UserDTO updatePosition(String userId, String posId, PositionDTO p);
    List<Position> getSymPositions(String id, String symbol);
    List<QuoteResponse> getPosQuotes(String id) throws TradeException;
    List<GraphData> getGraphData(String id, String interval, String start_date) throws TradeException;
    List<OrderData> getOrderHist(String id) throws TradeException;
}
