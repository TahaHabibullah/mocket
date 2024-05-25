package com.taha.backendservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taha.backendservice.exception.TradeException;
import com.taha.backendservice.client.TradeDataFeignClient;
import com.taha.backendservice.model.TwelveDataRequest;
import com.taha.backendservice.model.price.TimeIntervalResponse;
import com.taha.backendservice.model.quote.QuoteResponse;
import com.taha.backendservice.model.search.SymbolData;
import com.taha.backendservice.model.search.SymbolSearchRequest;
import com.taha.backendservice.model.search.SymbolSearchResponse;
import com.taha.backendservice.service.TradeService;
import com.taha.backendservice.constants.TradeConstant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class TradeServiceImpl implements TradeService {
    private static final Logger logger = LoggerFactory.getLogger(TradeServiceImpl.class);

    @Autowired
    private TradeDataFeignClient tradeDataFeignClient;

    @Autowired
    private ObjectMapper mapper;

    @Value("${api.key}")
    private String apiKey;

    @Override
    public QuoteResponse getQuoteData(TwelveDataRequest request) throws TradeException {
        try {
            logger.info("Request sent to Twelve Data /quote API: " + mapper.writeValueAsString(request));
            QuoteResponse quoteData = tradeDataFeignClient.getQuoteData(request.getSymbol(),
                                                                        request.getInterval(),
                                                                        request.getExchange(),
                                                                        request.getMicCode(),
                                                                        request.getCountry(),
                                                                        request.getVolumeTimePeriod(),
                                                                        request.getType(),
                                                                        request.getFormat(),
                                                                        request.getDelimiter(),
                                                                        request.getPrepost(),
                                                                        request.getEod(),
                                                                        request.getRollingPeriod(),
                                                                        apiKey).getBody();
            logger.info("Response from Twelve Data /quote API: " + mapper.writeValueAsString(quoteData));
            return quoteData;
        } catch(Exception e) {
            logger.error("Exception while calling Twelve Data API to fetch quote data: ", e);
            throw new TradeException("Exception while calling Twelve Data API to fetch quote data", e);
        }
    }

    @Override
    public TimeIntervalResponse getPriceData(TwelveDataRequest request) throws TradeException {
        try {
            logger.info("Request sent to Twelve Data /time_series API: " + mapper.writeValueAsString(request));
            TimeIntervalResponse priceData = tradeDataFeignClient.getLivePriceData(request.getSymbol(),
                                                                            request.getInterval(),
                                                                            request.getExchange(),
                                                                            request.getMicCode(),
                                                                            request.getCountry(),
                                                                            request.getType(),
                                                                            request.getOutputSize(),
                                                                            request.getFormat(),
                                                                            request.getDelimiter(),
                                                                            request.getPrepost(),
                                                                            apiKey).getBody();
            logger.info("Response from Twelve Data /time_series API: " + mapper.writeValueAsString(priceData));
            return priceData;
        } catch(Exception e) {
            logger.error("Exception while calling Twelve Data API to fetch ticker price data: ", e);
            throw new TradeException("Exception while calling Twelve Data API to fetch ticker price data", e);
        }
    }

    @Override
    public SymbolSearchResponse searchTickers(SymbolSearchRequest request) throws TradeException{
        try {
            logger.info("Request sent to Twelve Data /symbol_search API: " + mapper.writeValueAsString(request));

            SymbolSearchResponse tickers = tradeDataFeignClient.searchSymbol(request.getSymbol(),
                                                                                   request.getOutputSize(),
                                                                                   apiKey).getBody();
            logger.info("Response from Twelve Data /symbol_search API: " + mapper.writeValueAsString(tickers));
            tickers.setData(filterByRegion(request, tickers.getData()));
            return tickers;
        } catch(Exception e) {
            logger.error("Exception while calling Twelve Data API to search tickers: ", e);
            throw new TradeException("Exception while calling Twelve Data API to search tickers", e);
        }
    }

    @Override
    public String getLivePrice(TwelveDataRequest request){
        try {
            Map<String, String> livePrice = tradeDataFeignClient.getLivePrice(request.getSymbol(),
                                                                              request.getExchange(),
                                                                              request.getMicCode(),
                                                                              request.getCountry(),
                                                                              request.getType(),
                                                                              request.getOutputSize(),
                                                                              request.getFormat(),
                                                                              request.getDelimiter(),
                                                                              request.getPrepost(),
                                                                              apiKey).getBody();
            logger.info("Response from Twelve Data /price API: " + mapper.writeValueAsString(livePrice));
            return livePrice.get(TradeConstant.PRICE);
        } catch(Exception e) {
            logger.error("Exception while calling Twelve Data API to fetch live ticker price data: ", e);
        }
        return "";
    }

    private List<SymbolData> filterByRegion(SymbolSearchRequest request, List<SymbolData> responseData) {
        List<SymbolData> filteredList = new ArrayList<>();
        for(SymbolData symbol : responseData) {
            if(symbol.getCountry().equalsIgnoreCase(request.getCountry()))
                filteredList.add(symbol);
        }
        return filteredList;
    }
}
