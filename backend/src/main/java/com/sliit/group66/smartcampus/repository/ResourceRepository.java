package com.sliit.group66.smartcampus.repository;

package com.sliit.group66.smartcampus.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
    Optional<Resource> findByResourceCode(String resourceCode);
}