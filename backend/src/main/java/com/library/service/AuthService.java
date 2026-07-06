package com.library.service;

import com.library.dto.*;
import com.library.entity.Role;
import com.library.entity.User;
import com.library.exception.ApiException;
import com.library.repository.UserRepository;
import com.library.security.JwtService;
import com.library.security.PasswordService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
public class AuthService {

    @Inject
    UserRepository userRepository;

    @Inject
    PasswordService passwordService;

    @Inject
    JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email.toLowerCase())) {
            throw new ApiException(Response.Status.CONFLICT, "An account with this email already exists");
        }

        User user = new User();
        user.name = request.name;
        user.email = request.email.toLowerCase();
        user.password = passwordService.hash(request.password);
        user.role = Role.USER;
        user.isActive = true;
        userRepository.persist(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, UserResponse.from(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email.toLowerCase());
        if (user == null || !passwordService.verify(request.password, user.password)) {
            throw new ApiException(Response.Status.UNAUTHORIZED, "Invalid email or password");
        }
        if (!user.isActive) {
            throw new ApiException(Response.Status.FORBIDDEN, "This account has been deactivated");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, UserResponse.from(user));
    }
}
