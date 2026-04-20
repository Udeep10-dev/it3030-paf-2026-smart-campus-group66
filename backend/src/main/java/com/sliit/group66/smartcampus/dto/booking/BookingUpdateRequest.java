package com.sliit.group66.smartcampus.dto.booking;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingUpdateRequest {
	public Long resourceId;
	public LocalDate bookingDate;
	public LocalTime startTime;
	public LocalTime endTime;
	public Integer expectedAttendees;
	public String purpose;
}
