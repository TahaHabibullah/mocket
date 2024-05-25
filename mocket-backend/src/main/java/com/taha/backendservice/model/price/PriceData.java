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
}
