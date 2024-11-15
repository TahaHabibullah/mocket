package com.taha.backendservice.model.alpaca;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class AlpacaHistoricalResponse implements Serializable {
    private static final long serialVersionUID = 8818878241714890447L;

    @JsonProperty("bars")
    private Map<String, List<AlpacaBarResponse>> values;
    @JsonProperty("next_page_token")
    private String nextPageToken;
}
