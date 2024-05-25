package com.taha.backendservice.model.search;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class SymbolData implements Serializable {
    private static final long serialVersionUID = 633738333000889067L;
    private String symbol;
    private String instrument_name;
    private String exchange;
    private String mic_code;
    private String exchange_timezone;
    private String instrument_type;
    private String country;
    private String currency;
}
