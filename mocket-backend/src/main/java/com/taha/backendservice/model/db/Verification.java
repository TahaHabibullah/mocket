package com.taha.backendservice.model.db;

import org.bson.types.ObjectId;
import java.util.Date;

public class Verification {
    ObjectId id;
    String token;
    String userId;
    Date expiration;

    public Verification() {}

    public Verification(ObjectId id, String token, String userId, Date expiration) {
        this.id = id;
        this.token = token;
        this.userId = userId;
        this.expiration = expiration;
    }

    public ObjectId getId() {
        return id;
    }
    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }

    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Date getExpiration() {
        return expiration;
    }
    public void setExpiration(Date expiration) {
        this.expiration = expiration;
    }
}
