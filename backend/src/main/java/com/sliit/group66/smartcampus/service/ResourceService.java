package com.example.resource.service;

import com.example.resource.dto.ResourceDTO;
import java.util.List;

public interface ResourceService {

    ResourceDTO create(ResourceDTO dto);

    List<ResourceDTO> getAll();

    ResourceDTO getById(Long id);

    ResourceDTO update(Long id, ResourceDTO dto);

    void delete(Long id);
}