package com.example.resource.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resource_code", unique = true)
    private String resourceCode;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    private Integer capacity;

    @Column(nullable = false)
    private String location;

    private LocalTime availabilityStart;
    private LocalTime availabilityEnd;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceStatus status;

    private String description;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}