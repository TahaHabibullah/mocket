package com.taha.backendservice.model.price;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class PriceData implements Serializable {
    private static final long serialVersionUID = -7270434227046801699L;
    private String datetime;
    private String open;
    private String high;
    private String low;
    private String close;
    private String volume;

    public PriceData() {

    }

    public PriceData(String open, String close, String high, String low, String volume, String datetime) {
        this.open = open;
        this.close = close;
        this.high = high;
        this.low = low;
        this.volume = volume;
        this.datetime = datetime;
    }
}
