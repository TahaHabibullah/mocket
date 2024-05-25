package com.taha.backendservice.client;

import com.taha.backendservice.model.quote.QuoteResponse;
import com.taha.backendservice.model.price.TimeIntervalResponse;
import com.taha.backendservice.model.search.SymbolSearchResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Map;

/*https://twelvedata.com/docs#core-data*/

@Component
@FeignClient(name="trade-data-feign-client",
        url="${twelvedata.api.url}")
public interface TradeDataFeignClient {

    @RequestMapping(method=RequestMethod.GET, path="/quote")
    public ResponseEntity<QuoteResponse> getQuoteData(@RequestParam("symbol") String symbol,
                                                      @RequestParam("interval") String interval,
                                                      @RequestParam("exchange") String exchange,
                                                      @RequestParam("mic_code") String mic_code,
                                                      @RequestParam("country") String country,
                                                      @RequestParam("volume_time_period") String volume_time_period,
                                                      @RequestParam("type") String type,
                                                      @RequestParam("format") String format,
                                                      @RequestParam("delimiter") String delimiter,
                                                      @RequestParam("prepost") String prepost,
                                                      @RequestParam("eod") String eod,
                                                      @RequestParam("rolling_period") String rolling_period,
                                                      @RequestParam("apikey") String apikey);
    @RequestMapping(method=RequestMethod.GET, path="/time_series")
    public ResponseEntity<TimeIntervalResponse> getLivePriceData(@RequestParam("symbol") String symbol,
                                                                 @RequestParam("interval") String interval,
                                                                 @RequestParam("exchange") String exchange,
                                                                 @RequestParam("mic_code") String mic_code,
                                                                 @RequestParam("country") String country,
                                                                 @RequestParam("type") String type,
                                                                 @RequestParam("outputsize") String outputsize,
                                                                 @RequestParam("format") String format,
                                                                 @RequestParam("delimiter") String delimiter,
                                                                 @RequestParam("prepost") String prepost,
                                                                 @RequestParam("apikey") String apikey);

    @RequestMapping(method=RequestMethod.GET, path="/price")
    public ResponseEntity<Map<String, String>> getLivePrice(@RequestParam("symbol") String symbol,
                                                            @RequestParam("exchange") String exchange,
                                                            @RequestParam("mic_code") String mic_code,
                                                            @RequestParam("country") String country,
                                                            @RequestParam("type") String type,
                                                            @RequestParam("outputsize") String outputsize,
                                                            @RequestParam("format") String format,
                                                            @RequestParam("delimiter") String delimiter,
                                                            @RequestParam("prepost") String prepost,
                                                            @RequestParam("apikey") String apikey);

    @RequestMapping(method=RequestMethod.GET, path="/symbol_search")
    public ResponseEntity<SymbolSearchResponse> searchSymbol(@RequestParam("symbol") String symbol,
                                                             @RequestParam("outputsize") String outputsize,
                                                             @RequestParam("apikey") String apikey);
    }
