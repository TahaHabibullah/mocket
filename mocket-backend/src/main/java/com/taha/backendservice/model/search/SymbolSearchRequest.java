package com.taha.backendservice.model.search;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SymbolSearchRequest implements Serializable {
    private static final long serialVersionUID = -8495968317437027117L;
    private String symbol;
    private String outputSize;
    private String country;
}
