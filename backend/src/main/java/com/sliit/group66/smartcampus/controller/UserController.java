package com.sliit.group66.smartcampus.controller;

import com.sliit.group66.smartcampus.dto.user.UserSummaryResponse;
import com.sliit.group66.smartcampus.enums.UserRole;
import com.sliit.group66.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/assignable")
    public List<UserSummaryResponse> getAssignableUsers() {
        return userRepository.findByRoleInOrderByNameAsc(List.of(UserRole.STAFF, UserRole.ADMIN))
                .stream()
                .map(user -> new UserSummaryResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name()
                ))
                .toList();
    }
}
