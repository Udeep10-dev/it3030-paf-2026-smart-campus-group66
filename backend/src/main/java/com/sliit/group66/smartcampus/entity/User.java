package com.sliit.group66.smartcampus.entity;

import com.sliit.group66.smartcampus.enums.UserRole;
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
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.STUDENT;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
