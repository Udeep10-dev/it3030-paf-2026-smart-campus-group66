package com.sliit.group66.smartcampus.controller;

import com.sliit.group66.smartcampus.entity.Notification;
import com.sliit.group66.smartcampus.entity.User;
import com.sliit.group66.smartcampus.repository.UserRepository;
import com.sliit.group66.smartcampus.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(notificationService.getUserNotifications(user.getId()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    // Admin - view all notifications
    @GetMapping("/admin/all")
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    // Admin - send notification to a user
    @PostMapping("/admin/send")
    public ResponseEntity<Notification> sendNotification(@RequestBody NotificationRequest request) {
        Notification n = notificationService.createNotification(
                request.userId(),
                request.message(),
                com.sliit.group66.smartcampus.enums.NotificationType.GENERAL
        );
        return ResponseEntity.ok(n);
    }

    record NotificationRequest(Long userId, String message) {}

    @PostMapping("/test")
    public ResponseEntity<Notification> createTest(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Notification n = notificationService.createNotification(
                user.getId(),
                "Your booking has been approved!",
                com.sliit.group66.smartcampus.enums.NotificationType.BOOKING_APPROVED
        );
        return ResponseEntity.ok(n);
    }
}
