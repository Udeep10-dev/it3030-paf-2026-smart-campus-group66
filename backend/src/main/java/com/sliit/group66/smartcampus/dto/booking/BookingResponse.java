package com.sliit.group66.smartcampus.dto.booking;

import com.sliit.group66.smartcampus.enums.BookingStatus;
import java.time.LocalDate;
import java.time.LocalTime;

public class BookingResponse {
    public Long id;
    public Long resourceId;
    public LocalDate bookingDate;
    public LocalTime startTime;
    public LocalTime endTime;
    public Integer expectedAttendees;
    public String purpose;
    public BookingStatus status;
}