package com.taha.backendservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taha.backendservice.client.AlpacaFeignClient;
import com.taha.backendservice.exception.TradeException;
import com.taha.backendservice.client.TwelveDataFeignClient;
import com.taha.backendservice.mapper.TradeResponseMapper;
import com.taha.backendservice.model.AlpacaRequest;
import com.taha.backendservice.model.TwelveDataRequest;
import com.taha.backendservice.model.alpaca.AlpacaHistoricalResponse;
import com.taha.backendservice.model.alpaca.AlpacaLatestResponse;
import com.taha.backendservice.model.price.TimeIntervalResponse;
import com.taha.backendservice.model.quote.QuoteResponse;
import com.taha.backendservice.model.search.SymbolData;
import com.taha.backendservice.model.search.SymbolSearchRequest;
import com.taha.backendservice.model.search.SymbolSearchResponse;
import com.taha.backendservice.service.TradeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Component
public class TradeServiceImpl implements TradeService {
    private static final Logger logger = LoggerFactory.getLogger(TradeServiceImpl.class);

    @Autowired
    private TwelveDataFeignClient twelveDataFeignClient;

    @Autowired
    private AlpacaFeignClient alpacaFeignClient;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private TradeResponseMapper tradeResponseMapper;

    @Value("${api.key}")
    private String apiKey;

    @Value("${alpaca.api.key}")
    private String alpacaKey;

    @Value("${alpaca.api.secret}")
    private String alpacaSecret;

    @Override
    public QuoteResponse getQuoteData(TwelveDataRequest request) throws TradeException {
        try {
            logger.info("Request sent to Twelve Data /quote API: " + mapper.writeValueAsString(request));
            QuoteResponse quoteData = twelveDataFeignClient.getQuoteData(request.getSymbol(),
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
    public List<TimeIntervalResponse> getPriceData(AlpacaRequest request) throws TradeException {
        try {
            logger.info("Request sent to Alpaca Markets /v2/stocks/bars API: " + mapper.writeValueAsString(request));

            List<AlpacaHistoricalResponse> alpacaHistoricalResponseList = new ArrayList<>();
            String nextPageToken = null;
            AlpacaHistoricalResponse response;
            while(true) {
                AlpacaHistoricalResponse alpacaHistoricalResponse = alpacaFeignClient.getHistoricalData(request.getStart_date(),
                        request.getEnd_date(),
                        request.getInterval(),
                        request.getLimit(),
                        request.getAdjustment(),
                        request.getAsof(),
                        request.getFeed(),
                        request.getCurrency(),
                        nextPageToken,
                        request.getOrder(),
                        request.getSymbol(),
                        alpacaKey,
                        alpacaSecret).getBody();
                logger.info("Response from Alpaca Markets /v2/stocks/bars API: " + mapper.writeValueAsString(alpacaHistoricalResponse));

                alpacaHistoricalResponseList.add(alpacaHistoricalResponse);
                if(StringUtils.hasText(alpacaHistoricalResponse.getNextPageToken()))
                    nextPageToken = alpacaHistoricalResponse.getNextPageToken();
                else {
                    if(alpacaHistoricalResponseList.size() > 1)
                        response = tradeResponseMapper.joinAlpacaHistoricalResponses(alpacaHistoricalResponseList);
                    else
                        response = alpacaHistoricalResponseList.get(0);
                    break;
                }
            }
            return tradeResponseMapper.mapAlpacaHistoricalResponse(response, request.getInterval());
        } catch(Exception e) {
            logger.error("Exception while calling Alpaca Markets API to fetch ticker price data: ", e);
            throw new TradeException("Exception while calling Alpaca Markets API to fetch ticker price data", e);
        }
    }

    @Override
    public SymbolSearchResponse searchTickers(SymbolSearchRequest request) throws TradeException{
        try {
            logger.info("Request sent to Twelve Data /symbol_search API: " + mapper.writeValueAsString(request));

            SymbolSearchResponse tickers = twelveDataFeignClient.searchSymbol(request.getSymbol(),
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
    public String getLivePrice(AlpacaRequest request){
        try {
            AlpacaLatestResponse livePrice = alpacaFeignClient.getLiveTradePrice(request.getSymbol(),
                                                                              request.getFeed(),
                                                                              request.getCurrency(),
                                                                              alpacaKey,
                                                                              alpacaSecret).getBody();
            logger.info("Response from Alpaca Markets /v2/stocks/trades/latest API: " + mapper.writeValueAsString(livePrice));
            return String.valueOf(livePrice.getTrades().get(request.getSymbol()).getPrice());
        } catch(Exception e) {
            logger.error("Exception while calling Alpaca Markets API to fetch live ticker price data: ", e);
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
