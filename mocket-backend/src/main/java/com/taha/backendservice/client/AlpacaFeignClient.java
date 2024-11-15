package com.taha.backendservice.client;

import com.taha.backendservice.model.alpaca.AlpacaHistoricalResponse;
import com.taha.backendservice.model.alpaca.AlpacaLatestResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Component
@FeignClient(name="alpaca-feign-client",
        url="${alpaca.api.url}")
public interface AlpacaFeignClient {

    @RequestMapping(method= RequestMethod.GET, path="/v2/stocks/bars")
    public ResponseEntity<AlpacaHistoricalResponse> getHistoricalData(@RequestParam("start") String start,
                                                                         @RequestParam("end") String end,
                                                                         @RequestParam("timeframe") String timeframe,
                                                                         @RequestParam("limit") String limit,
                                                                         @RequestParam("adjustment") String adjustment,
                                                                         @RequestParam("asof") String asof,
                                                                         @RequestParam("feed") String feed,
                                                                         @RequestParam("currency") String currency,
                                                                         @RequestParam("page_token") String page_token,
                                                                         @RequestParam("sort") String sort,
                                                                         @RequestParam("symbols") String symbols,
                                                                         @RequestHeader("APCA-API-KEY-ID") String apiKey,
                                                                         @RequestHeader("APCA-API-SECRET-KEY") String apiSecret);

    @RequestMapping(method= RequestMethod.GET, path="/v2/stocks/bars/latest")
    public ResponseEntity<AlpacaLatestResponse> getLatestBarPrice(@RequestParam("symbols") String symbols,
                                                                   @RequestParam("feed") String feed,
                                                                   @RequestParam("currency") String currency,
                                                                   @RequestHeader("APCA-API-KEY-ID") String apiKey,
                                                                   @RequestHeader("APCA-API-SECRET-KEY") String apiSecret);

    @RequestMapping(method= RequestMethod.GET, path="/v2/stocks/trades/latest")
    public ResponseEntity<AlpacaLatestResponse> getLiveTradePrice(@RequestParam("symbols") String symbols,
                                                                 @RequestParam("feed") String feed,
                                                                 @RequestParam("currency") String currency,
                                                                 @RequestHeader("APCA-API-KEY-ID") String apiKey,
                                                                 @RequestHeader("APCA-API-SECRET-KEY") String apiSecret);
}