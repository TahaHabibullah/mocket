package com.taha.backendservice.model.db;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

public class User {
    private ObjectId id;
    private String email;
    private double balance;
    private List<Position> positions;

    private final static Logger logger = LoggerFactory.getLogger(User.class);

    public User() {}

    public User(ObjectId id, String email, double balance, List<Position> positions) {
        this.id = id;
        this.email = email;
        this.balance = balance;
        this.positions = positions;
    }
    public void closePosition(String id, int quantity) {
        for(int i = 0; i < positions.size(); i++) {
            Position p = positions.get(i);
            if(p.getId().equals(new ObjectId(id))) {
                if(p.isOpen()) {
                    if(quantity < 1) {
                        p.setOpen(false);
                        balance += p.getValue();
                        p.setCloseTimestamp(new Date());
                        positions.set(i, p);
                    }
                    else {
                        Position temp = new Position(new ObjectId(),
                                                     p.getSymbol(),
                                                     quantity,
                                                     p.getPrice(),
                                                     false,
                                                     p.getOpenTimestamp(),
                                                     new Date());
                        p.setQuantity(p.getQuantity() - quantity);
                        balance += temp.getValue();
                        positions.add(temp);
                    }
                }
                return;
            }
        }
    }
    public void addPosition(Position p) {
        p.setOpen(true);
        p.setOpenTimestamp(new Date());
        positions.add(p);
        balance -= p.getValue();
    }

    public List<Position> getSymPositions(String symbol) {
        List<Position> result = new ArrayList<>();
        for(int i = 0; i < positions.size(); i++) {
            Position p = positions.get(i);
            if(p.isOpen() && symbol.equals(p.getSymbol())) {
                result.add(p);
            }
        }
        return result;
    }
    public ObjectId getId() {
        return id;
    }
    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public double getBalance() {
        return balance;
    }
    public void setBalance(double balance) {
        this.balance = balance;
    }

    public List<Position> getPositions() {
        return positions;
    }
    public void setPositions(List<Position> positions) {
        this.positions = positions;
    }

    @Override
    public String toString() {
        return "User{" +
               "id='" + id + '\'' +
               ", email='" + email + '\'' +
               ", balance=" + balance +
               ", positions=" + positions +
               '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Double.compare(user.balance, balance) == 0 &&
               Objects.equals(id, user.id) &&
               Objects.equals(email, user.email) &&
               Objects.equals(positions, user.positions);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email, balance, positions);
    }
}
