package com.taha.backendservice.model.alpaca;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class AlpacaBarResponse implements Serializable {
    private static final long serialVersionUID = 7912487524485931541L;

    @JsonProperty("c")
    private double close;
    @JsonProperty("h")
    private double high;
    @JsonProperty("l")
    private double low;
    @JsonProperty("o")
    private double open;
    @JsonProperty("t")
    private String datetime;
    @JsonProperty("v")
    private long volume;
}
