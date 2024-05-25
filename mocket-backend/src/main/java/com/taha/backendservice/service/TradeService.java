package com.taha.backendservice.service;

import com.taha.backendservice.exception.TradeException;
import com.taha.backendservice.model.TwelveDataRequest;
import com.taha.backendservice.model.price.TimeIntervalResponse;
import com.taha.backendservice.model.quote.QuoteResponse;
import com.taha.backendservice.model.search.SymbolSearchRequest;
import com.taha.backendservice.model.search.SymbolSearchResponse;

public interface TradeService {
    public QuoteResponse getQuoteData(TwelveDataRequest request) throws TradeException;
    public TimeIntervalResponse getPriceData(TwelveDataRequest request) throws TradeException;
    public SymbolSearchResponse searchTickers(SymbolSearchRequest request) throws TradeException;
    public String getLivePrice(TwelveDataRequest request);
}
