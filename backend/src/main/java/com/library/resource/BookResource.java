package com.library.resource;

import com.library.dto.BookRequest;
import com.library.dto.BookResponse;
import com.library.entity.Book;
import com.library.service.BookService;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Path("/api/books")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class BookResource {

    @Inject
    BookService bookService;

    // Any authenticated user (user, librarian, admin) can browse the catalog.
    @GET
    @RolesAllowed({"USER", "LIBRARIAN", "ADMIN"})
    public List<BookResponse> list(@QueryParam("q") String query) {
        return bookService.search(query).stream().map(BookResponse::from).collect(Collectors.toList());
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"USER", "LIBRARIAN", "ADMIN"})
    public BookResponse get(@PathParam("id") UUID id) {
        return BookResponse.from(bookService.findById(id));
    }

    @POST
    @RolesAllowed({"LIBRARIAN", "ADMIN"})
    public Response create(@Valid BookRequest request) {
        Book book = bookService.create(request);
        return Response.status(Response.Status.CREATED).entity(BookResponse.from(book)).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"LIBRARIAN", "ADMIN"})
    public BookResponse update(@PathParam("id") UUID id, @Valid BookRequest request) {
        return BookResponse.from(bookService.update(id, request));
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({"LIBRARIAN", "ADMIN"})
    public Response delete(@PathParam("id") UUID id) {
        bookService.delete(id);
        return Response.noContent().build();
    }
}
