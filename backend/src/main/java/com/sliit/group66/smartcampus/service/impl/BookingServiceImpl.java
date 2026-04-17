@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    public BookingServiceImpl(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    public BookingResponse createBooking(BookingCreateRequest req) {
        Booking booking = new Booking();
        booking.setResourceId(req.resourceId);
        booking.setBookingDate(req.bookingDate);
        booking.setStartTime(req.startTime);
        booking.setEndTime(req.endTime);
        booking.setPurpose(req.purpose);
        booking.setStatus(BookingStatus.PENDING);

        return mapToResponse(bookingRepository.save(booking));
    }

    @Override
    public BookingResponse approve(Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        booking.setStatus(BookingStatus.APPROVED);
        return mapToResponse(bookingRepository.save(booking));
    }

    @Override
    public BookingResponse reject(Long id, String reason) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        booking.setStatus(BookingStatus.REJECTED);
        return mapToResponse(bookingRepository.save(booking));
    }

    private BookingResponse mapToResponse(Booking b) {
        BookingResponse r = new BookingResponse();
        r.id = b.getId();
        r.resourceId = b.getResourceId();
        r.bookingDate = b.getBookingDate();
        r.startTime = b.getStartTime();
        r.endTime = b.getEndTime();
        r.purpose = b.getPurpose();
        r.status = b.getStatus();
        return r;
    }
}