package com.taha.backendservice.model.db;
import com.taha.backendservice.constants.ERole;
import org.bson.types.ObjectId;

public class Role {
    private ObjectId id;
    private ERole type;
    public Role() {}

    public Role(ERole type) {
        this.type = type;
    }

    public ObjectId getId() {
        return id;
    }
    public void setId(ObjectId id) {
        this.id = id;
    }

    public ERole getType() {
        return type;
    }
    public void setType(ERole type) {
        this.type = type;
    }
}
