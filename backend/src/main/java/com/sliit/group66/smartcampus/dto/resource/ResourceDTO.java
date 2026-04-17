package com.sliit.group66.smartcampus.dto.resource;

import lombok.*;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceDTO {

    private Long id;
    private String resourceCode;
    private String name;
    private String type;
    private Integer capacity;
    private String location;
    private LocalTime availabilityStart;
    private LocalTime availabilityEnd;
    private String status;
    private String description;
}