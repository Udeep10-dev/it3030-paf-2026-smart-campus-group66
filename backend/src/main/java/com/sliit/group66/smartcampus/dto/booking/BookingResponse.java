public class BookingResponse {
    public Long id;
    public Long resourceId;
    public LocalDate bookingDate;
    public LocalTime startTime;
    public LocalTime endTime;
    public String purpose;
    public BookingStatus status;
}