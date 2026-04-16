package com.example.resource.service.impl;

import com.example.resource.dto.ResourceDTO;
import com.example.resource.entity.Resource;
import com.example.resource.enums.ResourceStatus;
import com.example.resource.repository.ResourceRepository;
import com.example.resource.service.ResourceService;
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
    public ResourceDTO create(ResourceDTO dto) {
        Resource resource = mapToEntity(dto);
        resource.setCreatedAt(LocalDateTime.now());
        resource.setUpdatedAt(LocalDateTime.now());

        return mapToDTO(repository.save(resource));
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