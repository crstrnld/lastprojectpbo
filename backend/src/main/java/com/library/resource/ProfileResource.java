package com.library.resource;

import com.library.dto.UpdateProfileRequest;
import com.library.dto.UserResponse;
import com.library.entity.User;
import com.library.security.CurrentUserProvider;
import com.library.service.UserService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

// Self-service profile management for the logged-in user of any role.
@Path("/api/profile")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed({"USER", "LIBRARIAN", "ADMIN"})
public class ProfileResource {

    @Inject
    CurrentUserProvider currentUserProvider;

    @Inject
    UserService userService;

    @GET
    public UserResponse me() {
        return UserResponse.from(currentUserProvider.getCurrentUser());
    }

    @PUT
    public UserResponse update(UpdateProfileRequest request) {
        User user = currentUserProvider.getCurrentUser();
        User updated = userService.updateProfile(user, request);
        return UserResponse.from(updated);
    }
}
