package com.taha.backendservice.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AlpacaRequest  implements Serializable {
    private static final long serialVersionUID = 8239428123847226952L;

    private String start_date;
    private String end_date;
    private String interval;
    private String limit;
    private String adjustment;
    private String asof;
    private String feed;
    private String currency;
    private String order;
    private String symbol;

    @JsonCreator
    public AlpacaRequest(String symbol) {
        this.symbol = symbol;
    }

    public AlpacaRequest(String symbol,
                             String interval,
                             String start_date,
                             String order) {
        this.symbol = symbol;
        this.interval = interval;
        this.start_date = start_date;
        this.order = order;
    }

    public AlpacaRequest() {

    }
}
