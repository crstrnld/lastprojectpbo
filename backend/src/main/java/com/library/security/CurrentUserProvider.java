package com.library.security;

import com.library.entity.User;
import com.library.repository.UserRepository;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.SecurityContext;
import java.util.UUID;
import org.eclipse.microprofile.jwt.JsonWebToken;

/**
 * Resolves the authenticated User entity for the current request from the
 * JWT subject claim (user id).
 */
@RequestScoped
public class CurrentUserProvider {

    @Inject
    JsonWebToken jwt;

    @Inject
    UserRepository userRepository;

    public User getCurrentUser() {
        String subject = jwt.getSubject();
        if (subject == null) {
            throw new NotFoundException("No authenticated user in request context");
        }
        User user = userRepository.findById(UUID.fromString(subject));
        if (user == null) {
            throw new NotFoundException("Authenticated user no longer exists");
        }
        return user;
    }
}
