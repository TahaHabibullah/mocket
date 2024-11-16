package com.taha.backendservice.mapper;

import com.taha.backendservice.model.alpaca.AlpacaBarResponse;
import com.taha.backendservice.model.alpaca.AlpacaHistoricalResponse;
import com.taha.backendservice.model.price.PriceData;
import com.taha.backendservice.model.price.TimeIntervalResponse;
import com.taha.backendservice.model.quote.FiftyTwoWeek;
import com.taha.backendservice.model.quote.QuoteResponse;
import org.springframework.stereotype.Component;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
public class TradeResponseMapper {

    public List<QuoteResponse> mapAlpacaHistoricalQuoteResponse(AlpacaHistoricalResponse alpacaHistoricalResponse) {
        List<QuoteResponse> quoteResponseList = new ArrayList<>();

        List<Double> closes = new ArrayList<>();
        List<AlpacaBarResponse> lastMonthBars = new ArrayList<>();
        for(String symbol : alpacaHistoricalResponse.getValues().keySet()) {
            AlpacaBarResponse latestBar = alpacaHistoricalResponse.getValues().get(symbol).get(alpacaHistoricalResponse.getValues().get(symbol).size() - 1);
            AlpacaBarResponse previousBar = alpacaHistoricalResponse.getValues().get(symbol).get(alpacaHistoricalResponse.getValues().get(symbol).size() - 2);
            String datetime = latestBar.getDatetime().split("T")[0];
            boolean dateFound = false;
            for(int i = 0; i < alpacaHistoricalResponse.getValues().get(symbol).size(); i++) {
                closes.add(alpacaHistoricalResponse.getValues().get(symbol).get(i).getClose());
                if((alpacaHistoricalResponse.getValues().get(symbol).get(i).getDatetime()).contains(findLastWeekday(LocalDate.now().minusMonths(1)).toString())) {
                    lastMonthBars = new ArrayList<>(alpacaHistoricalResponse.getValues().get(symbol).subList(i, alpacaHistoricalResponse.getValues().get(symbol).size()));
                    dateFound = true;
                }
            }
            if(!dateFound) {
                lastMonthBars = new ArrayList<>(alpacaHistoricalResponse.getValues().get(symbol).subList(alpacaHistoricalResponse.getValues().get(symbol).size() - 21, alpacaHistoricalResponse.getValues().get(symbol).size()));
            }
            List<Long> volumes = new ArrayList<>();
            for(AlpacaBarResponse barObj : lastMonthBars) {
                volumes.add(barObj.getVolume());
            }
            String averageVolume = String.valueOf(volumes.stream().mapToLong(Long::longValue).average().orElse(0));
            FiftyTwoWeek fiftyTwoWeek = new FiftyTwoWeek(String.valueOf(Collections.min(closes)), String.valueOf(Collections.max(closes)));
            quoteResponseList.add(new QuoteResponse(symbol, String.valueOf(latestBar.getOpen()), String.valueOf(latestBar.getHigh()),
                    String.valueOf(latestBar.getLow()), String.valueOf(previousBar.getClose()), String.valueOf(latestBar.getClose()), averageVolume, String.valueOf(latestBar.getVolume()), fiftyTwoWeek, datetime));
        }

        return quoteResponseList;
    }

    public AlpacaHistoricalResponse joinAlpacaHistoricalResponses(List<AlpacaHistoricalResponse> alpacaHistoricalResponseList, String symbols) {
        AlpacaHistoricalResponse combinedResponse = new AlpacaHistoricalResponse();
        List<String> symbolList = Arrays.asList(symbols.split(","));

        Map<String, List<AlpacaBarResponse>> values = new HashMap<>();
        for(String symbol : symbolList) {
            List<AlpacaBarResponse> priceList = new ArrayList<>();
            for(AlpacaHistoricalResponse alpacaHistoricalResponse : alpacaHistoricalResponseList) {
                if(alpacaHistoricalResponse.getValues().keySet().contains(symbol))
                    priceList.addAll(alpacaHistoricalResponse.getValues().get(symbol));
            }
            values.put(symbol, priceList);
        }
        combinedResponse.setValues(values);
        return combinedResponse;
    }

    public List<TimeIntervalResponse> mapAlpacaHistoricalResponse(AlpacaHistoricalResponse alpacaHistoricalResponse, String interval) {
        List<TimeIntervalResponse> timeIntervalResponseList = new ArrayList<>();

        for(String symbol : alpacaHistoricalResponse.getValues().keySet()) {
            TimeIntervalResponse timeIntervalResponse = new TimeIntervalResponse();
            timeIntervalResponse.setSymbol(symbol);
            List<PriceData> priceDataList = new ArrayList<>();
            for(AlpacaBarResponse barObj : alpacaHistoricalResponse.getValues().get(symbol)) {
                if(!interval.equals("1Day") && !isMarketOpen(barObj.getDatetime()))
                    continue;
                PriceData priceData = new PriceData(String.valueOf(barObj.getOpen()),
                        String.valueOf(barObj.getClose()),
                        String.valueOf(barObj.getHigh()),
                        String.valueOf(barObj.getLow()),
                        String.valueOf(barObj.getVolume()),
                        interval.equals("1Day") ? barObj.getDatetime().substring(0, barObj.getDatetime().indexOf('T')) : convertTime(barObj.getDatetime()));
                priceDataList.add(priceData);
            }
            timeIntervalResponse.setValues(priceDataList);
            timeIntervalResponseList.add(timeIntervalResponse);
        }
        return timeIntervalResponseList;
    }

    private LocalDate findLastWeekday(LocalDate date) {
        LocalDate lastWeekday = date;
        while (lastWeekday.getDayOfWeek() == DayOfWeek.SATURDAY || lastWeekday.getDayOfWeek() == DayOfWeek.SUNDAY) {
            lastWeekday = lastWeekday.minusDays(1);
        }
        return lastWeekday;
    }

    private boolean isMarketOpen(String datetime) {
        String datetimeString = datetime.replace("T", " ").replace("Z", "");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        LocalDateTime localDateTime = LocalDateTime.parse(datetimeString, formatter);
        ZonedDateTime sourceTime = localDateTime.atZone(ZoneId.of("UTC"));
        ZonedDateTime targetTime = sourceTime.withZoneSameInstant(ZoneId.of("America/New_York"));

        int hour = targetTime.getHour();
        int minute = targetTime.getMinute();

        int startHour = 9;
        int startMinute = 30;
        int endHour = 16;
        int endMinute = 0;

        return ((hour == startHour && minute >= startMinute) || hour > startHour) &&
            ((hour == endHour && minute == endMinute) || hour < endHour);
    }

    private String convertTime(String datetime) {
        String datetimeString = datetime.replace("T", " ").replace("Z", "");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        LocalDateTime localDateTime = LocalDateTime.parse(datetimeString, formatter);
        ZonedDateTime sourceTime = localDateTime.atZone(ZoneId.of("UTC"));
        ZonedDateTime targetTime = sourceTime.withZoneSameInstant(ZoneId.of("America/New_York"));

        return targetTime.format(formatter);
    }
}
