package com.taha.backendservice.model.quote;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FiftyTwoWeek implements Serializable {
    private static final long serialVersionUID = -7101573683837256856L;
    private String low;
    private String high;
    private String low_change;
    private String high_change;
    private String low_change_percent;
    private String high_change_percent;
    private String range;
}
