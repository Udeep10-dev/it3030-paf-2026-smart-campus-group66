package com.sliit.group66.smartcampus.security;

<<<<<<< HEAD
=======
import com.sliit.group66.smartcampus.entity.User;
import com.sliit.group66.smartcampus.repository.UserRepository;
>>>>>>> feature/member4-auth-notifications
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
<<<<<<< HEAD
=======
import org.springframework.security.oauth2.core.user.OAuth2User;
>>>>>>> feature/member4-auth-notifications
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

<<<<<<< HEAD
=======
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

>>>>>>> feature/member4-auth-notifications
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
<<<<<<< HEAD
        response.sendRedirect("http://localhost:5173/dashboard");
=======

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(email, user.getRole().name());

        response.sendRedirect("http://localhost:5173/dashboard?token=" + token);
>>>>>>> feature/member4-auth-notifications
    }
}
