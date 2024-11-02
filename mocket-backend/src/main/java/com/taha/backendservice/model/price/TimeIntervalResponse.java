package com.taha.backendservice.model.price;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;
import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class TimeIntervalResponse implements Serializable {
    private static final long serialVersionUID = 5450237265103037720L;
    private Meta meta;
    private List<PriceData> values;
    private String status;

    public TimeIntervalResponse fillMissingData(String interval) throws ParseException {
        if(status == "error") { return this; }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        int minutes;
        if(interval.equals("1Day")) {
            return this;
        }
        else if(interval.equals("1Hour")) {
            minutes = 60;
        }
        else if(interval.equals("15Min")) {
            minutes = 15;
        }
        else {
            minutes = 5;
        }

        List<PriceData> result = new ArrayList<>();
        for(int i = 0; i < values.size(); i++) {
            PriceData curr = values.get(i);
            result.add(curr);

            if(i + 1 < values.size()) {
                PriceData next = values.get(i+1);
                Date start = sdf.parse(curr.getDatetime());
                Date end = sdf.parse(next.getDatetime());
                long diff = 0;
                if(start.getDay() == end.getDay()) {
                    diff = (end.getTime() - start.getTime()) / (1000 * 60);
                }

                while(diff > minutes) {
                    Calendar calendar = Calendar.getInstance();
                    calendar.setTime(start);
                    calendar.add(Calendar.MINUTE, minutes);
                    String timestamp = sdf.format(calendar.getTime());
                    PriceData temp = new PriceData();
                    temp.setDatetime(timestamp);
                    temp.setClose(curr.getClose());
                    result.add(temp);

                    start = calendar.getTime();
                    curr = result.get(result.size() - 1);
                    diff = (end.getTime() - start.getTime()) / (1000 * 60);
                }
            }
        }
        this.setValues(result);
        return this;
    }

    public TimeIntervalResponse removeCloseDays() throws ParseException {
        if(status == "error") { return this; }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        List<PriceData> result = new ArrayList<>();
        for(int i = 0; i < values.size(); i++) {
            Date date = sdf.parse(values.get(i).getDatetime());
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            int day = calendar.get(Calendar.DAY_OF_WEEK);
            if(day != Calendar.SATURDAY && day != Calendar.SUNDAY) {
                result.add(values.get(i));
            }
        }
        this.setValues(result);
        return this;
    }
}
