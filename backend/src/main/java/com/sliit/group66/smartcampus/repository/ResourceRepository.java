package com.example.resource.repository;

import com.example.resource.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
    Optional<Resource> findByResourceCode(String resourceCode);
}