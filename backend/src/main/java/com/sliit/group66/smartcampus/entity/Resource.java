package com.sliit.group66.smartcampus.entity;

import com.sliit.group66.smartcampus.enums.ResourceStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String resourceCode;
    private String name;
    private String type;
    private Integer capacity;
    private String location;

    @Column(nullable = true)
    private LocalTime availabilityStart;

    @Column(nullable = true)
    private LocalTime availabilityEnd;

    @Enumerated(EnumType.STRING)
    private ResourceStatus status;

    private String description;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}