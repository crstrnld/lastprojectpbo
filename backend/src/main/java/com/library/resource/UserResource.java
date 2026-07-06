package com.library.resource;

import com.library.dto.UpdateUserRequest;
import com.library.dto.UserResponse;
import com.library.entity.User;
import com.library.service.UserService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

// Admin-only: full user CRUD, role changes, activation toggling.
@Path("/api/users")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed({"ADMIN"})
public class UserResource {

    @Inject
    UserService userService;

    @GET
    public List<UserResponse> list() {
        return userService.listAll().stream().map(UserResponse::from).collect(Collectors.toList());
    }

    @GET
    @Path("/{id}")
    public UserResponse get(@PathParam("id") UUID id) {
        return UserResponse.from(userService.findById(id));
    }

    @PUT
    @Path("/{id}")
    public UserResponse update(@PathParam("id") UUID id, UpdateUserRequest request) {
        User user = userService.updateAsAdmin(id, request);
        return UserResponse.from(user);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") UUID id) {
        userService.delete(id);
        return Response.noContent().build();
    }
}
