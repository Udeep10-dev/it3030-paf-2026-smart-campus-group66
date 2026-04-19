package com.sliit.group66.smartcampus.dto.booking;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingCreateRequest {
    public Long resourceId;
    public LocalDate bookingDate;
    public LocalTime startTime;
    public LocalTime endTime;
    public String purpose;
}