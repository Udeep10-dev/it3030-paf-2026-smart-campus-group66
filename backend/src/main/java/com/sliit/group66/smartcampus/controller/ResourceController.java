package com.sliit.group66.smartcampus.controller;

import com.sliit.group66.smartcampus.dto.ResourceDTO;
import com.sliit.group66.smartcampus.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/resources")
@RequiredArgsConstructor
@CrossOrigin
public class ResourceController {

    private final ResourceService service;

    @PostMapping
    public ResourceDTO create(@RequestBody ResourceDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<ResourceDTO> getAll() {
        return service.getAll();
    }

    @GetMapping("/filter")
    public List<ResourceDTO> filterResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String capacity
    ) {
        Integer cap = null;

        System.out.println("Filtering resources with - Type: " + type +
                ", Location: " + location +
                ", Capacity: " + capacity);

        try {
            if (capacity != null && !capacity.trim().isEmpty()) {
                cap = Integer.parseInt(capacity.trim());
            }
        } catch (Exception e) {
            throw new RuntimeException("Invalid capacity value");
        }

        return service.filterResources(type, location, cap);
    }

    @GetMapping("/{id:\\d+}")
    public ResourceDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id:\\d+}")
    public ResourceDTO update(@PathVariable Long id, @RequestBody ResourceDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id:\\d+}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}