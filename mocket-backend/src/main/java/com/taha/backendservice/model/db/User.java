package com.taha.backendservice.model.db;


import org.bson.types.ObjectId;

import java.util.*;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;

public class User {
    private ObjectId id;
    private String email;
    private String password;
    private double balance;
    private List<Position> positions;
    private boolean verified;

    private Set<Role> roles = new HashSet<>();

    public User() {}

    public User(ObjectId id,
                String email,
                String password,
                double balance,
                List<Position> positions,
                boolean verified) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.balance = balance;
        this.positions = positions;
        this.verified = verified;
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
                                             p.getBuy(),
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
                p.setSell(price);
                balance += p.getQuantity() * price;
                p.setCloseTimestamp(ZonedDateTime.now(ZoneId.of("America/New_York"))
                        .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                updatePosition(p.getId().toString(), p);
                count += p.getQuantity();
            }
        }
    }
    public void addPosition(Position p) {
        if(p.getValue() < balance) {
            p.setOpen(true);
            p.setOpenTimestamp(ZonedDateTime.now(ZoneId.of("America/New_York"))
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            positions.add(p);
            balance -= p.getValue();
        }
    }

    public void updatePosition(String id, Position p) {
        for(int i = 0; i < positions.size(); i++) {
            if(positions.get(i).getId().equals(new ObjectId(id))) {
                positions.set(i, p);
                return;
            }
        }
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
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
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

    public Set<Role> getRoles() {
        return roles;
    }
    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

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
