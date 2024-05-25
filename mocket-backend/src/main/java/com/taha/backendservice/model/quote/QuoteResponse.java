package com.taha.backendservice.model.quote;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class QuoteResponse implements Serializable {
    private static final long serialVersionUID = -30098676091186539L;
    private String symbol;
    private String name;
    private String exchange;
    private String mic_code;
    private String currency;
    private String datetime;
    private long timestamp;
    private String open;
    private String high;
    private String low;
    private String close;
    private String volume;
    private String previous_close;
    private String change;
    private String percent_change;
    private String average_volume;
    private String rolling_1d_change;
    private String rolling_7d_change;
    private String rolling_period_change;
    @JsonProperty("is_market_open")
    private boolean is_market_open;
    private FiftyTwoWeek fifty_two_week;
    private String extended_change;
    private String extended_percent_change;
    private String extended_price;
    private long extended_timestamp;
}
