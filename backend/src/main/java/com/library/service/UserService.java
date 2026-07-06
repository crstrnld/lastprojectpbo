package com.library.service;

import com.library.dto.UpdateProfileRequest;
import com.library.dto.UpdateUserRequest;
import com.library.entity.User;
import com.library.exception.ApiException;
import com.library.repository.UserRepository;
import com.library.security.PasswordService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class UserService {

    @Inject
    UserRepository userRepository;

    @Inject
    PasswordService passwordService;

    public List<User> listAll() {
        return userRepository.listAll();
    }

    public User findById(UUID id) {
        User user = userRepository.findById(id);
        if (user == null) {
            throw new ApiException(Response.Status.NOT_FOUND, "User not found");
        }
        return user;
    }

    @Transactional
    public User updateAsAdmin(UUID id, UpdateUserRequest request) {
        User user = findById(id);
        if (request.name != null && !request.name.isBlank()) {
            user.name = request.name;
        }
        if (request.email != null && !request.email.isBlank()) {
            String newEmail = request.email.toLowerCase();
            if (!newEmail.equals(user.email) && userRepository.existsByEmail(newEmail)) {
                throw new ApiException(Response.Status.CONFLICT, "Email is already in use");
            }
            user.email = newEmail;
        }
        if (request.role != null) {
            user.role = request.role;
        }
        if (request.isActive != null) {
            user.isActive = request.isActive;
        }
        return user;
    }

    @Transactional
    public void delete(UUID id) {
        User user = findById(id);
        userRepository.delete(user);
    }

    @Transactional
    public User updateProfile(User user, UpdateProfileRequest request) {
        if (request.name != null && !request.name.isBlank()) {
            user.name = request.name;
        }
        if (request.email != null && !request.email.isBlank()) {
            String newEmail = request.email.toLowerCase();
            if (!newEmail.equals(user.email) && userRepository.existsByEmail(newEmail)) {
                throw new ApiException(Response.Status.CONFLICT, "Email is already in use");
            }
            user.email = newEmail;
        }
        if (request.newPassword != null && !request.newPassword.isBlank()) {
            if (request.currentPassword == null || !passwordService.verify(request.currentPassword, user.password)) {
                throw new ApiException(Response.Status.BAD_REQUEST, "Current password is incorrect");
            }
            if (request.newPassword.length() < 6) {
                throw new ApiException(Response.Status.BAD_REQUEST, "New password must be at least 6 characters");
            }
            user.password = passwordService.hash(request.newPassword);
        }
        return user;
    }
}
