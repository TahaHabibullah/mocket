package com.taha.backendservice.model.db;

import org.bson.types.ObjectId;
import java.util.Date;
import java.util.Objects;

public class Position {
    private ObjectId id;
    private String symbol;
    private int quantity;
    private double price;
    private boolean open;
    private Date openTimestamp;
    private Date closeTimestamp;

    public Position() {}

    public Position(ObjectId id,
                    String symbol,
                    int quantity,
                    double price,
                    boolean open,
                    Date openTimestamp,
                    Date closeTimestamp) {
        this.id = id;
        this.symbol = symbol;
        this.quantity = quantity;
        this.price = price;
        this.open = open;
        this.openTimestamp = openTimestamp;
        this.closeTimestamp = closeTimestamp;
    }

    public double getValue() {
        return quantity * price;
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

    public double getPrice() {
        return price;
    }
    public void setPrice(double price) {
        this.price = price;
    }

    public boolean isOpen() {
        return open;
    }
    public void setOpen(boolean open) {
        this.open = open;
    }

    public Date getOpenTimestamp() {
        return openTimestamp;
    }
    public void setOpenTimestamp(Date timestamp) {
        this.openTimestamp = timestamp;
    }

    public Date getCloseTimestamp() {
        return closeTimestamp;
    }
    public void setCloseTimestamp(Date timestamp) {
        this.closeTimestamp = timestamp;
    }

    @Override
    public String toString() {
        return "Position{" +
                "id='" + id + '\'' +
                ", symbol='" + symbol + '\'' +
                ", quantity=" + quantity +
                ", price=" + price +
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
               Double.compare(position.price, price) == 0 &&
               open == position.open && Objects.equals(id, position.id) &&
               Objects.equals(symbol, position.symbol) &&
               Objects.equals(openTimestamp, position.openTimestamp) &&
               Objects.equals(closeTimestamp, position.closeTimestamp);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, symbol, quantity, price, open, openTimestamp, closeTimestamp);
    }
}
