package com.sliit.group66.smartcampus.controller;

package com.sliit.group66.smartcampus.dto.ResourceDTO;
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

    @GetMapping("/{id}")
    public ResourceDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public ResourceDTO update(@PathVariable Long id, @RequestBody ResourceDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}