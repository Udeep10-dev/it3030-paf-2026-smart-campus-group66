package com.sliit.group66.smartcampus.entity;

import com.sliit.group66.smartcampus.enums.NotificationType;
import jakarta.persistence.*;
<<<<<<< HEAD
import lombok.Data;
import java.time.LocalDateTime;

@Data
=======
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
>>>>>>> feature/member4-auth-notifications
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
<<<<<<< HEAD
    private boolean isRead = false;
=======
    private boolean read = false;
>>>>>>> feature/member4-auth-notifications

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
