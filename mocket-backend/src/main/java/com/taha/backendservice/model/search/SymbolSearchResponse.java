package com.taha.backendservice.model.search;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class SymbolSearchResponse implements Serializable {
    private static final long serialVersionUID = -505793313301689077L;

    private List<SymbolData> data;
    private String status;

}
