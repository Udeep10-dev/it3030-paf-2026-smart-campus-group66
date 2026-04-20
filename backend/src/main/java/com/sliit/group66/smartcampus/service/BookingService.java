package com.sliit.group66.smartcampus.service;

import com.sliit.group66.smartcampus.dto.booking.BookingCreateRequest;
import com.sliit.group66.smartcampus.dto.booking.BookingResponse;
import com.sliit.group66.smartcampus.dto.booking.BookingUpdateRequest;
import com.sliit.group66.smartcampus.enums.BookingStatus;
import java.util.List;

public interface BookingService {

    BookingResponse createBooking(BookingCreateRequest request);

    BookingResponse approve(Long bookingId);

    BookingResponse reject(Long bookingId, String reason);

    BookingResponse cancel(Long bookingId);

    BookingResponse update(Long bookingId, BookingUpdateRequest request);

    void delete(Long bookingId);

    List<BookingResponse> getBookingsByStatus(BookingStatus status);

    List<BookingResponse> getBookingsByStatusAndUserId(BookingStatus status, Long userId);
}