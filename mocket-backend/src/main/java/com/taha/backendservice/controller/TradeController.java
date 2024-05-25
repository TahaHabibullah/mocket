package com.taha.backendservice.controller;

import com.taha.backendservice.exception.TradeException;
import com.taha.backendservice.model.TwelveDataRequest;
import com.taha.backendservice.model.price.TimeIntervalResponse;
import com.taha.backendservice.model.quote.QuoteResponse;
import com.taha.backendservice.model.search.SymbolSearchRequest;
import com.taha.backendservice.model.search.SymbolSearchResponse;
import com.taha.backendservice.service.TradeService;
import com.taha.backendservice.constants.TradeConstant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.time.Duration;

@CrossOrigin
@RestController
@RequestMapping(TradeConstant.TRADE_ROOT_URI)
public class TradeController {

    @Autowired
    private TradeService tradeService;

    @PostMapping(value= TradeConstant.QUOTE, produces = MediaType.APPLICATION_JSON_VALUE)
    public QuoteResponse getQuoteData(@RequestBody TwelveDataRequest request) throws TradeException {
        return tradeService.getQuoteData(request);
    }

    @PostMapping(value= TradeConstant.PRICE_DATA, produces = MediaType.APPLICATION_JSON_VALUE)
    public TimeIntervalResponse getPriceData(@RequestBody TwelveDataRequest request) throws TradeException {
        return tradeService.getPriceData(request);
    }

    @PostMapping(value= TradeConstant.TICKER_SEARCH, produces = MediaType.APPLICATION_JSON_VALUE)
    public SymbolSearchResponse searchTickers(@RequestBody SymbolSearchRequest request) throws TradeException {
        return tradeService.searchTickers(request);
    }

    @GetMapping(value= TradeConstant.LIVE_PRICE, produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> getLivePrice(@RequestParam String symbol) {
        return Flux.interval(Duration.ofSeconds(8))
                .map(interval -> ServerSentEvent.<String>builder()
                .data(tradeService.getLivePrice(new TwelveDataRequest(symbol)))
                .retry(Duration.ofSeconds(1))
                .build());
    }
}
