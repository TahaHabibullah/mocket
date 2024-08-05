package com.taha.backendservice.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TwelveDataRequest implements Serializable {
    private static final long serialVersionUID = -3037884615151450760L;
    private String symbol;
    private String interval;
    private String exchange;
    private String micCode;
    private String country;
    private String volumeTimePeriod;
    private String type;
    private String outputSize;
    private String format;
    private String delimiter;
    private String prepost;
    private String eod;
    private String rollingPeriod;
    private String dp;
    private String order;
    private String timezone;
    private String date;
    private String start_date;
    private String end_date;
    private String previous_close;
    @JsonCreator
    public TwelveDataRequest(String symbol) {this.symbol = symbol;}

    public TwelveDataRequest(String symbol,
                             String interval,
                             String start_date,
                             String order) {
        this.symbol = symbol;
        this.interval = interval;
        this.start_date = start_date;
        this.order = order;
    }

    public TwelveDataRequest() {

    }
}
