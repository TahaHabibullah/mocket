package com.taha.backendservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taha.backendservice.client.TradeDataFeignClient;
import com.taha.backendservice.exception.TradeException;
import com.taha.backendservice.model.TwelveDataRequest;
import com.taha.backendservice.model.price.TimeIntervalResponse;
import com.taha.backendservice.model.quote.QuoteResponse;
import com.taha.backendservice.model.search.SymbolData;
import com.taha.backendservice.model.search.SymbolSearchRequest;
import com.taha.backendservice.model.search.SymbolSearchResponse;
import com.taha.backendservice.service.impl.TradeServiceImpl;
import feign.FeignException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class TradeServiceImplTest {

    @InjectMocks
    private TradeServiceImpl tradeService;

    @Mock
    private TradeDataFeignClient tradeDataFeignClient;

    @Mock
    private ObjectMapper mapper;

    @BeforeEach
    void init() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testGetQuoteData() throws TradeException {
        QuoteResponse feignResponse = new QuoteResponse();
        String symbol = "INTC";
        feignResponse.setSymbol(symbol);
        when(tradeDataFeignClient.getQuoteData(any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any())).thenReturn(new ResponseEntity<>(feignResponse, HttpStatus.OK));
        QuoteResponse response = tradeService.getQuoteData(new TwelveDataRequest());
        assertEquals(symbol, response.getSymbol());
    }

    @Test
    void testExceptionGetQuoteData() {
        when(tradeDataFeignClient.getQuoteData(any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any())).thenThrow(FeignException.class);
        try {
            tradeService.getQuoteData(new TwelveDataRequest());
        } catch(Exception e) {
            assertEquals(TradeException.class, e.getClass());
        }
    }

    @Test
    void testGetPriceData() throws TradeException {
        TimeIntervalResponse feignResponse = new TimeIntervalResponse();
        String status = "success";
        feignResponse.setStatus(status);
        when(tradeDataFeignClient.getLivePriceData(any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any())).thenReturn(new ResponseEntity<>(feignResponse, HttpStatus.OK));
        TimeIntervalResponse response = tradeService.getPriceData(new TwelveDataRequest());
        assertEquals(status, response.getStatus());
    }

    @Test
    void testExceptionGetPriceData() {
        when(tradeDataFeignClient.getLivePriceData(any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any())).thenThrow(FeignException.class);
        try {
            tradeService.getPriceData(new TwelveDataRequest());
        } catch(Exception e) {
            assertEquals(TradeException.class, e.getClass());
        }
    }

    @Test
    void testSearchTickers() throws TradeException {
        SymbolSearchResponse feignResponse = new SymbolSearchResponse();
        SymbolData symbolData = new SymbolData();
        symbolData.setSymbol("AAPL");
        symbolData.setCountry("USA");
        List<SymbolData> symbolDataList = Arrays.asList(symbolData);
        feignResponse.setData(symbolDataList);
        when(tradeDataFeignClient.searchSymbol(any(),
                any(),
                any())).thenReturn(new ResponseEntity<>(feignResponse, HttpStatus.OK));
        SymbolSearchRequest request = new SymbolSearchRequest();
        request.setSymbol("AAPL");
        request.setCountry("USA");
        SymbolSearchResponse response = tradeService.searchTickers(request);
        assertNotNull(response);
    }

    @Test
    void testExceptionSearchTickers() throws TradeException {
        when(tradeDataFeignClient.searchSymbol(any(),
                any(),
                any())).thenThrow(FeignException.class);
        try {
            tradeService.searchTickers(new SymbolSearchRequest());
        } catch(Exception e) {
            assertEquals(TradeException.class, e.getClass());
        }
    }

    @Test
    void testGetLivePrice() {
        Map<String, String> feignResponse = new HashMap();
        feignResponse.put("price", "value");
        when(tradeDataFeignClient.getLivePrice(any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any())).thenReturn(new ResponseEntity<>(feignResponse, HttpStatus.OK));
        String response = tradeService.getLivePrice(new TwelveDataRequest());
        assertNotNull(response);
    }

    @Test
    void testExceptionGetLivePrice() {
        when(tradeDataFeignClient.getLivePrice(any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any())).thenThrow(FeignException.class);
        try {
            tradeService.getLivePrice(new TwelveDataRequest());
        } catch(Exception e) {
            assertEquals(FeignException.class, e.getClass());
        }
    }
}
