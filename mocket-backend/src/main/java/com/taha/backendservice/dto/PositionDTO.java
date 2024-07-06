package com.taha.backendservice.dto;

import com.taha.backendservice.model.db.Position;
import org.bson.types.ObjectId;
import java.util.Date;
public record PositionDTO (String id,
                           String symbol,
                           int quantity,
                           double price,
                           boolean open,
                           String openTimestamp,
                           String closeTimestamp) {

    public PositionDTO(Position p) {
        this(p.getId() == null ? new ObjectId().toHexString() : p.getId().toHexString(), p.getSymbol(),
             p.getQuantity(), p.getPrice(), p.isOpen(), p.getOpenTimestamp(), p.getCloseTimestamp());
    }

    public Position toPosition() {
        ObjectId _id = id == null ? new ObjectId() : new ObjectId(id);
        return new Position(_id, symbol, quantity, price, open, openTimestamp, closeTimestamp);
    }
}
