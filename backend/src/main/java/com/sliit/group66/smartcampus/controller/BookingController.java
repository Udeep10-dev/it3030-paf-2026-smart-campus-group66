package com.sliit.group66.smartcampus.controller;

import com.sliit.group66.smartcampus.dto.booking.BookingCreateRequest;
import com.sliit.group66.smartcampus.dto.booking.BookingDecisionRequest;
import com.sliit.group66.smartcampus.dto.booking.BookingResponse;
import com.sliit.group66.smartcampus.dto.booking.BookingUpdateRequest;
import com.sliit.group66.smartcampus.enums.BookingStatus;
import com.sliit.group66.smartcampus.service.BookingService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public BookingResponse create(@RequestBody BookingCreateRequest req) {
        return bookingService.createBooking(req);
    }

    @PutMapping("/{id}/approve")
    public BookingResponse approve(@PathVariable Long id) {
        return bookingService.approve(id);
    }

    @PutMapping("/{id}/reject")
    public BookingResponse reject(
            @PathVariable Long id,
            @RequestBody BookingDecisionRequest req) {
        return bookingService.reject(id, req.reason);
    }

    @PutMapping("/{id}/cancel")
    public BookingResponse cancel(@PathVariable Long id) {
        return bookingService.cancel(id);
    }

    @PutMapping("/{id}")
    public BookingResponse update(
            @PathVariable Long id,
            @RequestBody BookingUpdateRequest req) {
        return bookingService.update(id, req);
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        bookingService.delete(id);
    }

    @GetMapping
    public List<BookingResponse> list(@RequestParam BookingStatus status) {
        return bookingService.getBookingsByStatus(status);
    }

    @GetMapping("/my")
    public List<BookingResponse> listMyBookings(
            @RequestParam BookingStatus status,
            @RequestParam(defaultValue = "1") Long userId) {
        return bookingService.getBookingsByStatusAndUserId(status, userId);
    }
}