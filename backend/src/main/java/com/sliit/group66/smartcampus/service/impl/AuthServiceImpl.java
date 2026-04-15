package com.sliit.group66.smartcampus.service.impl;

import com.sliit.group66.smartcampus.entity.User;
import com.sliit.group66.smartcampus.repository.UserRepository;
import com.sliit.group66.smartcampus.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    @Override
    public Optional<User> getCurrentUser(String email) {
        return userRepository.findByEmail(email);
    }
}
