package com.library.resource;

import com.library.dto.BorrowRequest;
import com.library.dto.BorrowResponse;
import com.library.entity.BorrowRecord;
import com.library.entity.Role;
import com.library.entity.User;
import com.library.security.CurrentUserProvider;
import com.library.service.BorrowService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Path("/api/borrow")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed({"USER", "LIBRARIAN", "ADMIN"})
public class BorrowResource {

    @Inject
    BorrowService borrowService;

    @Inject
    CurrentUserProvider currentUserProvider;

    @POST
    public Response borrow(@Valid BorrowRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();
        BorrowRecord record = borrowService.borrowBook(currentUser, request);
        return Response.status(Response.Status.CREATED).entity(BorrowResponse.from(record)).build();
    }

    @PUT
    @Path("/{id}/return")
    public BorrowResponse returnBook(@PathParam("id") UUID id) {
        User currentUser = currentUserProvider.getCurrentUser();
        boolean isStaff = currentUser.role == Role.LIBRARIAN || currentUser.role == Role.ADMIN;
        BorrowRecord record = borrowService.returnBook(currentUser, id, isStaff);
        return BorrowResponse.from(record);
    }

    // The caller's own borrow history.
    @GET
    @Path("/history")
    public List<BorrowResponse> history() {
        borrowService.refreshOverdueStatuses();
        User currentUser = currentUserProvider.getCurrentUser();
        return borrowService.history(currentUser).stream().map(BorrowResponse::from).collect(Collectors.toList());
    }

    // All active loans across every user - staff only.
    @GET
    @Path("/active")
    @RolesAllowed({"LIBRARIAN", "ADMIN"})
    public List<BorrowResponse> active() {
        borrowService.refreshOverdueStatuses();
        return borrowService.allActive().stream().map(BorrowResponse::from).collect(Collectors.toList());
    }
}
