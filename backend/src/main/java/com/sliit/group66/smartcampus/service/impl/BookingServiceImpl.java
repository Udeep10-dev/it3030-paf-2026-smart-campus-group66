package com.sliit.group66.smartcampus.service.impl;

import com.sliit.group66.smartcampus.dto.booking.BookingCreateRequest;
import com.sliit.group66.smartcampus.dto.booking.BookingResponse;
import com.sliit.group66.smartcampus.entity.Booking;
import com.sliit.group66.smartcampus.enums.BookingStatus;
import com.sliit.group66.smartcampus.enums.NotificationType;
import com.sliit.group66.smartcampus.repository.BookingRepository;
import com.sliit.group66.smartcampus.service.BookingService;
import com.sliit.group66.smartcampus.service.NotificationService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public BookingServiceImpl(BookingRepository bookingRepository, NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
    }

    @Override
    public BookingResponse createBooking(BookingCreateRequest req) {
        Booking booking = new Booking();
        booking.setResourceId(req.resourceId);
        booking.setUserId(1L);
        booking.setBookingDate(req.bookingDate);
        booking.setStartTime(req.startTime);
        booking.setEndTime(req.endTime);
        booking.setExpectedAttendees(req.expectedAttendees);
        booking.setPurpose(req.purpose);
        booking.setStatus(BookingStatus.PENDING);

        return mapToResponse(bookingRepository.save(booking));
    }

    @Override
    public BookingResponse approve(Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        booking.setStatus(BookingStatus.APPROVED);
        BookingResponse response = mapToResponse(bookingRepository.save(booking));
        try {
            notificationService.createNotification(
                booking.getUserId(),
                "Your booking for resource #" + booking.getResourceId() + " has been approved.",
                NotificationType.BOOKING_APPROVED
            );
        } catch (Exception ignored) {}
        return response;
    }

    @Override
    public BookingResponse reject(Long id, String reason) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        booking.setStatus(BookingStatus.REJECTED);
        BookingResponse response = mapToResponse(bookingRepository.save(booking));
        try {
            notificationService.createNotification(
                booking.getUserId(),
                "Your booking for resource #" + booking.getResourceId() + " has been rejected." + (reason != null ? " Reason: " + reason : ""),
                NotificationType.BOOKING_REJECTED
            );
        } catch (Exception ignored) {}
        return response;
    }

    @Override
    public List<BookingResponse> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private BookingResponse mapToResponse(Booking b) {
        BookingResponse r = new BookingResponse();
        r.id = b.getId();
        r.resourceId = b.getResourceId();
        r.bookingDate = b.getBookingDate();
        r.startTime = b.getStartTime();
        r.endTime = b.getEndTime();
        r.expectedAttendees = b.getExpectedAttendees();
        r.purpose = b.getPurpose();
        r.status = b.getStatus();
        return r;
    }
}