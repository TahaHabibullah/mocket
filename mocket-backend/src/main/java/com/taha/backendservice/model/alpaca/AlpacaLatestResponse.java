package com.taha.backendservice.model.alpaca;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AlpacaLatestResponse implements Serializable {
    private static final long serialVersionUID = -8054397515321245410L;

    Map<String, AlpacaBarResponse> bars;
    Map<String, AlpacaTradeResponse> trades;
}
