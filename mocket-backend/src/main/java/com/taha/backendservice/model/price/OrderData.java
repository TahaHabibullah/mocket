package com.taha.backendservice.model.price;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderData implements Serializable {
    private String symbol;
    private String timestamp;
    private double buy;
    private double sell;
    private int quantity;

    public OrderData(String symbol,
                     String timestamp,
                     double buy,
                     double sell,
                     int quantity) {
        this.symbol = symbol;
        this.timestamp = timestamp;
        this.buy = buy;
        this.sell = sell;
        this.quantity = quantity;
    }

    public OrderData(String symbol,
                     String timestamp,
                     double buy,
                     int quantity) {
        this.symbol = symbol;
        this.timestamp = timestamp;
        this.buy = buy;
        this.quantity = quantity;
    }
}
