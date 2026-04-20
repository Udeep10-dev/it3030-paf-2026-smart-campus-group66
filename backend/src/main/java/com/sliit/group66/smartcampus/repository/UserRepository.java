package com.sliit.group66.smartcampus.repository;

import com.sliit.group66.smartcampus.entity.User;
import com.sliit.group66.smartcampus.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRoleInOrderByNameAsc(Collection<UserRole> roles);
}
