package com.taha.backendservice.model.db;

import org.bson.types.ObjectId;
import java.util.Objects;

public class Position {
    private ObjectId id;
    private String symbol;
    private int quantity;
    private double buy;
    private double sell;
    private boolean open;
    private String openTimestamp;
    private String closeTimestamp;

    public Position() {}

    public Position(ObjectId id,
                    String symbol,
                    int quantity,
                    double buy,
                    double sell,
                    boolean open,
                    String openTimestamp,
                    String closeTimestamp) {
        this.id = id;
        this.symbol = symbol;
        this.quantity = quantity;
        this.buy = buy;
        this.sell = sell;
        this.open = open;
        this.openTimestamp = openTimestamp;
        this.closeTimestamp = closeTimestamp;
    }

    public double getValue() {
        return quantity * buy;
    }
    public ObjectId getId() {
        return id;
    }
    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getSymbol() {
        return symbol;
    }
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getBuy() {
        return buy;
    }
    public void setBuy(double buy) {
        this.buy = buy;
    }

    public double getSell() {
        return sell;
    }
    public void setSell(double sell) {
        this.sell = sell;
    }

    public boolean isOpen() {
        return open;
    }
    public void setOpen(boolean open) {
        this.open = open;
    }

    public String getOpenTimestamp() {
        return openTimestamp;
    }
    public void setOpenTimestamp(String timestamp) {
        this.openTimestamp = timestamp;
    }

    public String getCloseTimestamp() {
        return closeTimestamp;
    }
    public void setCloseTimestamp(String timestamp) {
        this.closeTimestamp = timestamp;
    }

    @Override
    public String toString() {
        return "Position{" +
                "id='" + id + '\'' +
                ", symbol='" + symbol + '\'' +
                ", quantity=" + quantity +
                ", buy=" + buy +
                ", sell=" + sell +
                ", open=" + open +
                ", openTimestamp=" + openTimestamp +
                ", closeTimestamp=" + closeTimestamp +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Position position = (Position) o;
        return quantity == position.quantity &&
               Double.compare(position.buy, buy) == 0 &&
               Double.compare(position.sell, sell) == 0 &&
               open == position.open && Objects.equals(id, position.id) &&
               Objects.equals(symbol, position.symbol) &&
               Objects.equals(openTimestamp, position.openTimestamp) &&
               Objects.equals(closeTimestamp, position.closeTimestamp);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, symbol, quantity, buy, sell, open, openTimestamp, closeTimestamp);
    }
}
