package com.taha.backendservice.constants;

public interface DBConstant {
    public final String USER = "/user";
    public final String USERS = "/users";
    public final String GET_USER = "/user/{id}";
    public final String GET_USERS = "/users/{id}";
    public final String GET_COUNT = "/users/count";
    public final String GET_POS = "/user/getPos";
    public final String GET_QUOTES = "/user/getQuotes";
    public final String GET_GRAPH = "/user/getGraph";
    public final String GET_HIST = "/user/getHist";
    public final String PUT_ADD = "/user/addPos";
    public final String PUT_CLOSE = "/user/closePos";
    public final String PUT_UPDATE = "/user/updatePos";
    public final String DB_ROOT_URI = "/database";
}