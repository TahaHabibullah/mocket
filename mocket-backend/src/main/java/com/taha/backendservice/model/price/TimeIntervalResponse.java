package com.taha.backendservice.model.price;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class TimeIntervalResponse implements Serializable {
    private static final long serialVersionUID = 5450237265103037720L;
    private Meta meta;
    private List<PriceData> values;
    private String status;
}
