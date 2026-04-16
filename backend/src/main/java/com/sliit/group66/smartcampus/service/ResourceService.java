package com.sliit.group66.smartcampus.service;

import com.sliit.group66.smartcampus.dto.ResourceDTO;
import java.util.List;

public interface ResourceService {

    ResourceDTO create(ResourceDTO dto);

    List<ResourceDTO> getAll();

    ResourceDTO getById(Long id);

    ResourceDTO update(Long id, ResourceDTO dto);

    void delete(Long id);

    List<ResourceDTO> filterResources(String type, String location, Integer capacity);
}