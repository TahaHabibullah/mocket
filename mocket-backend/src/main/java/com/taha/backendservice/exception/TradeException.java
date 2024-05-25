package com.taha.backendservice.exception;

public class TradeException extends Exception {
    public TradeException(String errorMessage, Throwable err) {
        super(errorMessage, err);
    }
}
