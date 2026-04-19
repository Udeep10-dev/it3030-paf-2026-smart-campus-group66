package com.sliit.group66.smartcampus.repository;

import com.sliit.group66.smartcampus.entity.Booking;
import com.sliit.group66.smartcampus.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStatus(BookingStatus status);
}