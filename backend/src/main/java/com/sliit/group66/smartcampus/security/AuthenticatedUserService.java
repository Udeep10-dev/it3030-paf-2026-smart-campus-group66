package com.sliit.group66.smartcampus.security;

import com.sliit.group66.smartcampus.entity.User;
import com.sliit.group66.smartcampus.exception.ForbiddenOperationException;
import com.sliit.group66.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticatedUserService {

    private final UserRepository userRepository;

    public User getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ForbiddenOperationException("Authentication is required");
        }

        String email = normalizeEmail(authentication.getName());

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ForbiddenOperationException("Authenticated user not found"));
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
