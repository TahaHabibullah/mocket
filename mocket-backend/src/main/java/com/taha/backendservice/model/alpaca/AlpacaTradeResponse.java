package com.taha.backendservice.model.alpaca;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class AlpacaTradeResponse implements Serializable {
    private static final long serialVersionUID = 2632966381726757987L;

    @JsonProperty("i")
    private long id;
    @JsonProperty("p")
    private double price;
    @JsonProperty("s")
    private long size;
    @JsonProperty("t")
    private String datetime;
    @JsonProperty("x")
    private String exchangecode;
    @JsonProperty("z")
    private String tape;
}
