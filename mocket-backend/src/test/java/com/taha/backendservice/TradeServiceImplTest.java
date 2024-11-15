package com.taha.backendservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taha.backendservice.client.AlpacaFeignClient;
import com.taha.backendservice.client.TwelveDataFeignClient;
import com.taha.backendservice.exception.TradeException;
import com.taha.backendservice.mapper.TradeResponseMapper;
import com.taha.backendservice.model.AlpacaRequest;
import com.taha.backendservice.model.TwelveDataRequest;
import com.taha.backendservice.model.alpaca.AlpacaBarResponse;
import com.taha.backendservice.model.alpaca.AlpacaHistoricalResponse;
import com.taha.backendservice.model.alpaca.AlpacaLatestResponse;
import com.taha.backendservice.model.price.TimeIntervalResponse;
import com.taha.backendservice.model.quote.QuoteResponse;
import com.taha.backendservice.model.search.SymbolData;
import com.taha.backendservice.model.search.SymbolSearchRequest;
import com.taha.backendservice.model.search.SymbolSearchResponse;
import com.taha.backendservice.service.impl.TradeServiceImpl;
import feign.Feign;
import feign.FeignException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.sql.Time;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class TradeServiceImplTest {

    @InjectMocks
    private TradeServiceImpl tradeService;

    @Mock
    private TwelveDataFeignClient twelveDataFeignClient;

    @Mock
    private AlpacaFeignClient alpacaFeignClient;

    @Mock
    private TradeResponseMapper tradeResponseMapper;

    @Mock
    private ObjectMapper mapper;

    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetQuoteData() throws TradeException {
        QuoteResponse feignResponse = new QuoteResponse();
        String symbol = "INTC";
        feignResponse.setSymbol(symbol);
        when(twelveDataFeignClient.getQuoteData(any(),
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
        when(twelveDataFeignClient.getQuoteData(any(),
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
    void testGetQuoteDataAlpaca() throws TradeException {
        AlpacaHistoricalResponse feignResponse = new AlpacaHistoricalResponse();
        when(alpacaFeignClient.getHistoricalData(any(),
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
        when(tradeResponseMapper.mapAlpacaHistoricalQuoteResponse(any())).thenReturn(Arrays.asList(new QuoteResponse()));
        List<QuoteResponse> response = tradeService.getQuoteData(new AlpacaRequest());
        assertNotNull(response);
    }

    @Test
    void testGetQuoteDataAlpacaException() throws TradeException {
        when(alpacaFeignClient.getHistoricalData(any(),
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
            List<QuoteResponse> response = tradeService.getQuoteData(new AlpacaRequest());
        } catch (Exception e) {
            assertEquals(TradeException.class, e.getClass());
        }
    }

    @Test
    void testGetPriceData() throws TradeException {
        AlpacaHistoricalResponse feignResponse = new AlpacaHistoricalResponse();
        feignResponse.setValues(new HashMap<>());
        when(alpacaFeignClient.getHistoricalData(any(),
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
        when(tradeResponseMapper.mapAlpacaHistoricalResponse(any(), any())).thenReturn(new ArrayList<>());
        List<TimeIntervalResponse> response = tradeService.getPriceData(new AlpacaRequest());
        assertNotNull(response);
    }

    @Test
    void testGetPriceDataList() throws TradeException {
        AlpacaHistoricalResponse feignResponse = buildHistoricalResponse();
        feignResponse.setNextPageToken("token");
        AlpacaHistoricalResponse secondFeignResponse = buildHistoricalResponse();
        when(alpacaFeignClient.getHistoricalData(any(),
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
                any())).thenReturn(new ResponseEntity<>(feignResponse, HttpStatus.OK)).thenReturn(new ResponseEntity<>(secondFeignResponse, HttpStatus.OK));
        when(tradeResponseMapper.mapAlpacaHistoricalResponse(any(), any())).thenReturn(new ArrayList<>());
        List<TimeIntervalResponse> response = tradeService.getPriceData(new AlpacaRequest());
        assertNotNull(response);
    }

    @Test
    void testExceptionGetPriceData() {
        when(alpacaFeignClient.getHistoricalData(any(),
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
            tradeService.getPriceData(new AlpacaRequest());
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
        when(twelveDataFeignClient.searchSymbol(any(),
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
        when(twelveDataFeignClient.searchSymbol(any(),
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
        AlpacaLatestResponse feignResponse = new AlpacaLatestResponse();
        feignResponse.setTrades(new HashMap<>());
        when(alpacaFeignClient.getLiveTradePrice(any(),
                any(),
                any(),
                any(),
                any())).thenReturn(new ResponseEntity<>(feignResponse, HttpStatus.OK));
        String response = tradeService.getLivePrice(new AlpacaRequest());
        assertNotNull(response);
    }

    @Test
    void testExceptionGetLivePrice() {
        when(alpacaFeignClient.getLiveTradePrice(any(),
                any(),
                any(),
                any(),
                any())).thenThrow(FeignException.class);
        try {
            tradeService.getLivePrice(new AlpacaRequest());
        } catch(Exception e) {
            assertEquals(FeignException.class, e.getClass());
        }
    }

    private AlpacaHistoricalResponse buildHistoricalResponse() {
        AlpacaHistoricalResponse response = new AlpacaHistoricalResponse();
        Map<String, List<AlpacaBarResponse>> values = new HashMap<>();

        AlpacaBarResponse barResponse = new AlpacaBarResponse();
        barResponse.setClose(1.1);
        barResponse.setDatetime("11-01-2024T00:00:00Z");
        barResponse.setHigh(2.2);
        barResponse.setLow(0.0);
        barResponse.setOpen(1.0);
        barResponse.setVolume(123);
        List<AlpacaBarResponse> alpacaBarResponseList = Arrays.asList(barResponse);

        values.put("ticker", alpacaBarResponseList);
        response.setValues(values);
        return response;
    }
}
