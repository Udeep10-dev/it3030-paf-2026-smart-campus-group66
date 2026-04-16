package com.sliit.group66.smartcampus.repository;

import com.sliit.group66.smartcampus.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
