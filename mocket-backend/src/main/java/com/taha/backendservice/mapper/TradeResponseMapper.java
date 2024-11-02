package com.taha.backendservice.mapper;

import com.taha.backendservice.model.alpaca.AlpacaBarResponse;
import com.taha.backendservice.model.alpaca.AlpacaHistoricalResponse;
import com.taha.backendservice.model.price.Meta;
import com.taha.backendservice.model.price.PriceData;
import com.taha.backendservice.model.price.TimeIntervalResponse;
import org.springframework.stereotype.Component;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
public class TradeResponseMapper {

    public AlpacaHistoricalResponse joinAlpacaHistoricalResponses(List<AlpacaHistoricalResponse> alpacaHistoricalResponseList) {
        AlpacaHistoricalResponse combinedResponse = new AlpacaHistoricalResponse();

        Map<String, List<AlpacaBarResponse>> values = new HashMap<>();
        for(String symbol : alpacaHistoricalResponseList.get(0).getValues().keySet()) {
            List<AlpacaBarResponse> priceList = new ArrayList<>();
            for(AlpacaHistoricalResponse alpacaHistoricalResponse : alpacaHistoricalResponseList) {
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
            Meta meta = new Meta();
            meta.setSymbol(symbol);
            timeIntervalResponse.setMeta(meta);
            List<PriceData> priceDataList = new ArrayList<>();
            for(AlpacaBarResponse barObj : alpacaHistoricalResponse.getValues().get(symbol)) {
                if(interval.equals("1Day") || isTimeValid(barObj.getDatetime())) {
                    PriceData priceData = new PriceData(String.valueOf(barObj.getOpen()),
                            String.valueOf(barObj.getClose()),
                            String.valueOf(barObj.getHigh()),
                            String.valueOf(barObj.getLow()),
                            String.valueOf(barObj.getVolume()),
                            interval.equals("1Day") ? barObj.getDatetime().substring(0, barObj.getDatetime().indexOf('T')) : convertTime(barObj.getDatetime()));
                    priceDataList.add(priceData);
                }
            }
            timeIntervalResponse.setValues(priceDataList);
            timeIntervalResponseList.add(timeIntervalResponse);
        }
        return timeIntervalResponseList;
    }

    private boolean isTimeValid(String datetime) {
        String timeString = datetime.substring(datetime.indexOf('T') + 1, datetime.indexOf('Z'));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");

        LocalTime time = LocalTime.parse(timeString, formatter);
        LocalTime start = LocalTime.of(13, 29);
        LocalTime end = LocalTime.of(20, 1);

        return time.isAfter(start) && time.isBefore(end);
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
