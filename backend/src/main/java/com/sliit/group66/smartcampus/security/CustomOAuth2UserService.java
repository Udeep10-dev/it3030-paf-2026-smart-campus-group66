package com.sliit.group66.smartcampus.security;

import com.sliit.group66.smartcampus.entity.User;
import com.sliit.group66.smartcampus.enums.UserRole;
import com.sliit.group66.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = normalizeEmail(oAuth2User.getAttribute("email"));
        String name = oAuth2User.getAttribute("name");
        String avatar = oAuth2User.getAttribute("picture");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setAvatarUrl(avatar);
            return newUser;
        });
        // always sync role so changes to determineRole take effect on next login
        user.setRole(determineRole(email));
        userRepository.save(user);

        return oAuth2User;
    }

    private UserRole determineRole(String email) {
        String normalizedEmail = normalizeEmail(email);
        if (normalizedEmail == null) return UserRole.STUDENT;

        // Hardcoded admin accounts (real Google accounts with admin access)
        java.util.Set<String> adminEmails = java.util.Set.of(
            "it23829060@my.sliit.lk",
            "it23814288@my.sliit.lk",
            "it23823998@my.sliit.lk"
        );

        if (adminEmails.contains(normalizedEmail)) return UserRole.ADMIN;

        // Domain-based rules
        if (normalizedEmail.endsWith("@it.sliit.lk"))  return UserRole.STAFF;
        if (normalizedEmail.endsWith("@my.sliit.lk"))  return UserRole.STAFF;  // other SLIIT = staff
        if (normalizedEmail.endsWith("@sliit.lk"))     return UserRole.STAFF;
        if (normalizedEmail.endsWith("@gmail.com"))    return UserRole.STUDENT;

        return UserRole.STUDENT;
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            return null;
        }
        return email.trim().toLowerCase();
    }
}
