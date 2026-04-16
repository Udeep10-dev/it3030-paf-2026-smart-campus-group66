package com.sliit.group66.smartcampus.entity;

import com.sliit.group66.smartcampus.enums.BookingStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long resourceId;

    private Long userId;

    private LocalDate bookingDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private String purpose;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // ✅ getters & setters (generate from IDE)
}