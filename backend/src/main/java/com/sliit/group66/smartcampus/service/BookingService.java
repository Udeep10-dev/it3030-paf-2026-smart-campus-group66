public interface BookingService {

    BookingResponse createBooking(BookingCreateRequest request);

    BookingResponse approve(Long bookingId);

    BookingResponse reject(Long bookingId, String reason);

    List<BookingResponse> getBookingsByStatus(BookingStatus status);
}