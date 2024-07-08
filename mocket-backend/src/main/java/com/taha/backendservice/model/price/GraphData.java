package com.taha.backendservice.model.price;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class GraphData implements Serializable {
    private static final long serialVersionUID = -7270434227046801699L;
    private String datetime;
    private double close;

    public GraphData(String datetime, double close) {
        this.datetime = datetime;
        this.close = close;
    }
}

