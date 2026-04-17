package com.sliit.group66.smartcampus.mapper;

import com.sliit.group66.smartcampus.dto.booking.BookingResponse;
import com.sliit.group66.smartcampus.entity.Booking;

public final class BookingMapper {

	private BookingMapper() {
	}

	public static BookingResponse toResponse(Booking booking) {
		BookingResponse response = new BookingResponse();
		response.id = booking.getId();
		response.resourceId = booking.getResourceId();
		response.bookingDate = booking.getBookingDate();
		response.startTime = booking.getStartTime();
		response.endTime = booking.getEndTime();
		response.purpose = booking.getPurpose();
		response.status = booking.getStatus();
		return response;
	}
}
