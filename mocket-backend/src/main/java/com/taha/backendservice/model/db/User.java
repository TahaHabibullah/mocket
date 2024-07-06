package com.taha.backendservice.model.db;

import org.bson.types.ObjectId;
import java.util.ArrayList;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;

public class User {
    private ObjectId id;
    private String email;
    private double balance;
    private List<Position> positions;

    public User() {}

    public User(ObjectId id, String email, double balance, List<Position> positions) {
        this.id = id;
        this.email = email;
        this.balance = balance;
        this.positions = positions;
    }
    public void closePosition(String symbol, int quantity, double price) {
        List<Position> sympos = getSymPositions(symbol);
        int count = 0;
        for(int i = 0; i < sympos.size(); i++) {
            if(count >= quantity)
                break;
            Position p = sympos.get(i);
            if(p.getQuantity() > quantity) {
                Position temp = new Position(new ObjectId(),
                                             p.getSymbol(),
                                             quantity - count,
                                             price,
                                             false,
                                             p.getOpenTimestamp(),
                                             ZonedDateTime.now(ZoneId.of("America/New_York"))
                                             .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                p.setQuantity(p.getQuantity() - (quantity - count));
                balance += temp.getValue();
                positions.add(temp);
                count += quantity;
            }
            else {
                p.setOpen(false);
                balance += p.getQuantity() * price;
                p.setCloseTimestamp(ZonedDateTime.now(ZoneId.of("America/New_York"))
                        .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                positions.set(i, p);
                count += p.getQuantity();
            }
        }
    }
    public void addPosition(Position p) {
        p.setOpen(true);
        p.setOpenTimestamp(ZonedDateTime.now(ZoneId.of("America/New_York"))
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
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
