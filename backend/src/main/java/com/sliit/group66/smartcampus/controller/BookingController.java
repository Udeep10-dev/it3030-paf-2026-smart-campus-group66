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

    @GetMapping
    public List<BookingResponse> list(@RequestParam BookingStatus status) {
        return bookingService.getBookingsByStatus(status);
    }
}