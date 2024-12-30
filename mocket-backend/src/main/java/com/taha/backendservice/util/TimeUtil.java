package com.taha.backendservice.util;

import org.springframework.stereotype.Component;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

@Component
public class TimeUtil {

    private final int year = LocalDate.now().getYear();
    private final String newYears = getObservedDate(LocalDate.of(year, 1, 1));
    private final String mlkDay = getSpecificDay(year, 1, 2, DayOfWeek.MONDAY);
    private final String presidentsDay = getSpecificDay(year, 2, 2, DayOfWeek.MONDAY);
    private final String memorialDay = getSpecificDay(year, 5, 3, DayOfWeek.MONDAY);
    private final String juneteenth = getObservedDate(LocalDate.of(year, 6, 19));
    private final String independenceDay = getObservedDate(LocalDate.of(year, 7, 4));
    private final String laborDay = getSpecificDay(year, 9, 0, DayOfWeek.MONDAY);
    private final String thanksgiving = getSpecificDay(year, 11, 3, DayOfWeek.THURSDAY);
    private final String christmas = getObservedDate(LocalDate.of(year, 12, 25));
    private final List<String> usHolidays = Arrays.asList(newYears, mlkDay, presidentsDay, memorialDay,
        juneteenth, independenceDay, laborDay, thanksgiving, christmas);

    private final String independenceEve = LocalDate.of(year, 7, 3).format(DateTimeFormatter.ofPattern("MM/dd/yyyy"));
    private final String blackFriday = getSpecificDay(year, 11, 3, DayOfWeek.FRIDAY);
    private final String christmasEve = LocalDate.of(year, 12, 24).format(DateTimeFormatter.ofPattern("MM/dd/yyyy"));
    private final List<String> halfDays = Arrays.asList(independenceEve, blackFriday, christmasEve);

    public boolean isMarketOpen(String datetime) {
        String datetimeString = datetime.replace("T", " ").replace("Z", "");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        LocalDateTime localDateTime = LocalDateTime.parse(datetimeString, formatter);
        ZonedDateTime sourceTime = localDateTime.atZone(ZoneId.of("UTC"));
        ZonedDateTime targetTime = sourceTime.withZoneSameInstant(ZoneId.of("America/New_York"));

        int hour = targetTime.getHour();
        int minute = targetTime.getMinute();

        int startHour = 9;
        int startMinute = 30;
        int endHour = !isHalfDay(targetTime) ? 16 : 13;
        int endMinute = 0;
        return !isWeekend(targetTime) && !isUSHoliday(targetTime) && ((hour == startHour && minute >= startMinute) || hour > startHour) &&
                ((hour == endHour && minute == endMinute) || hour < endHour);
    }

    public LocalDate findLastWeekday(LocalDate date) {
        LocalDate lastWeekday = date;
        while (lastWeekday.getDayOfWeek() == DayOfWeek.SATURDAY || lastWeekday.getDayOfWeek() == DayOfWeek.SUNDAY) {
            lastWeekday = lastWeekday.minusDays(1);
        }
        return lastWeekday;
    }

    public String convertTime(String datetime) {
        String datetimeString = datetime.replace("T", " ").replace("Z", "");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        LocalDateTime localDateTime = LocalDateTime.parse(datetimeString, formatter);
        ZonedDateTime sourceTime = localDateTime.atZone(ZoneId.of("UTC"));
        ZonedDateTime targetTime = sourceTime.withZoneSameInstant(ZoneId.of("America/New_York"));

        return targetTime.format(formatter);
    }

    private String getSpecificDay(int year, int month, int week, DayOfWeek dayOfWeek) {
        LocalDate firstDayOfMonth = LocalDate.of(year, month, 1);
        LocalDate firstDayOfWeek = firstDayOfMonth.with(java.time.temporal.TemporalAdjusters.nextOrSame(dayOfWeek));
        LocalDate targetDate = firstDayOfWeek.plusWeeks(week - 1);
        return targetDate.format(DateTimeFormatter.ofPattern("MM/dd/yyyy"));
    }

    private String getObservedDate(LocalDate date) {
        LocalDate lastWeekday = date;
        if(lastWeekday.getDayOfWeek() == DayOfWeek.SATURDAY) {
            lastWeekday = lastWeekday.minusDays(1);
        } else if(lastWeekday.getDayOfWeek() == DayOfWeek.SUNDAY) {
            lastWeekday = lastWeekday.plusDays(1);
        }

        return lastWeekday.format(DateTimeFormatter.ofPattern("MM/dd/yyyy"));
    }

    private boolean isWeekend(ZonedDateTime date) {
        return date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY;
    }

    private boolean isUSHoliday(ZonedDateTime date) {
        return usHolidays.contains(date.format(DateTimeFormatter.ofPattern("MM/dd/yyyy")));
    }

    private boolean isHalfDay(ZonedDateTime date) {
        return !isWeekend(date) && halfDays.contains(date.format(DateTimeFormatter.ofPattern("MM/dd/yyyy")));
    }
}
