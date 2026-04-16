package com.sliit.group66.smartcampus.service;

import com.sliit.group66.smartcampus.entity.User;
import java.util.Optional;

public interface AuthService {
    Optional<User> getCurrentUser(String email);
}
