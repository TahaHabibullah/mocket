package com.taha.backendservice.dto;

import com.taha.backendservice.model.db.Position;
import org.bson.types.ObjectId;
public record PositionDTO (String id,
                           String symbol,
                           int quantity,
                           double buy,
                           double sell,
                           boolean open,
                           String openTimestamp,
                           String closeTimestamp) {

    public PositionDTO(Position p) {
        this(p.getId() == null ? new ObjectId().toHexString() : p.getId().toHexString(), p.getSymbol(),
             p.getQuantity(), p.getBuy(), p.getSell(), p.isOpen(), p.getOpenTimestamp(), p.getCloseTimestamp());
    }

    public Position toPosition() {
        ObjectId _id = id == null ? new ObjectId() : new ObjectId(id);
        return new Position(_id, symbol, quantity, buy, sell, open, openTimestamp, closeTimestamp);
    }
}
