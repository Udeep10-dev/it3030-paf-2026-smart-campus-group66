package com.sliit.group66.smartcampus.service.impl;

import com.sliit.group66.smartcampus.dto.ResourceDTO;
import com.sliit.group66.smartcampus.entity.Resource;
import com.sliit.group66.smartcampus.enums.ResourceStatus;
import com.sliit.group66.smartcampus.repository.ResourceRepository;
import com.sliit.group66.smartcampus.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository repository;

    @Override
    public Resource mapToEntity(ResourceDTO dto) {
        Resource resource = new Resource();

        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setAvailabilityStart(
            dto.getAvailabilityStart() != null ? dto.getAvailabilityStart() : LocalTime.of(8, 0)
        );
        resource.setAvailabilityEnd(
            dto.getAvailabilityEnd() != null ? dto.getAvailabilityEnd() : LocalTime.of(17, 0)
        );
        resource.setStatus(
            dto.getStatus() != null
                ? ResourceStatus.valueOf(dto.getStatus().toUpperCase())
                : ResourceStatus.ACTIVE
        );

        resource.setDescription(dto.getDescription());
        resource.setResourceCode("RES-" + UUID.randomUUID().toString().substring(0, 8));

        return resource;
    }

    @Override
    public List<ResourceDTO> getAll() {
        return repository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResourceDTO getById(Long id) {
        Resource resource = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        return mapToDTO(resource);
    }

    @Override
    public ResourceDTO update(Long id, ResourceDTO dto) {
        Resource resource = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setStatus(ResourceStatus.valueOf(dto.getStatus()));
        resource.setDescription(dto.getDescription());
        resource.setUpdatedAt(LocalDateTime.now());

        return mapToDTO(repository.save(resource));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }


    private ResourceDTO mapToDTO(Resource resource) {
        return ResourceDTO.builder()
                .id(resource.getId())
                .resourceCode(resource.getResourceCode())
                .name(resource.getName())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .availabilityStart(resource.getAvailabilityStart())
                .availabilityEnd(resource.getAvailabilityEnd())
                .status(resource.getStatus().name())
                .description(resource.getDescription())
                .build();
    }

    private Resource mapToEntity(ResourceDTO dto) {
        return Resource.builder()
                .resourceCode(dto.getResourceCode())
                .name(dto.getName())
                .type(dto.getType())
                .capacity(dto.getCapacity())
                .location(dto.getLocation())
                .availabilityStart(dto.getAvailabilityStart())
                .availabilityEnd(dto.getAvailabilityEnd())
                .status(ResourceStatus.valueOf(dto.getStatus()))
                .description(dto.getDescription())
                .build();
    }
}