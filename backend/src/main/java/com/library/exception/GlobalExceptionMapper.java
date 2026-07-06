package com.library.exception;

import com.library.dto.ErrorResponse;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.NotAuthorizedException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.jboss.logging.Logger;

@Provider
public class GlobalExceptionMapper implements ExceptionMapper<Throwable> {

    private static final Logger LOG = Logger.getLogger(GlobalExceptionMapper.class);

    @Override
    public Response toResponse(Throwable exception) {
        if (exception instanceof ApiException apiException) {
            return Response.status(apiException.status)
                    .entity(new ErrorResponse(apiException.getMessage()))
                    .build();
        }
        if (exception instanceof ConstraintViolationException cve) {
            String message = cve.getConstraintViolations().stream()
                    .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                    .reduce((a, b) -> a + "; " + b)
                    .orElse("Validation failed");
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(message))
                    .build();
        }
        if (exception instanceof NotFoundException) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse(exception.getMessage() != null ? exception.getMessage() : "Resource not found"))
                    .build();
        }
        if (exception instanceof NotAuthorizedException) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ErrorResponse("Not authorized"))
                    .build();
        }
        if (exception instanceof SecurityException) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity(new ErrorResponse(exception.getMessage() != null ? exception.getMessage() : "Forbidden"))
                    .build();
        }

        LOG.error("Unhandled exception", exception);
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(new ErrorResponse("An unexpected error occurred"))
                .build();
    }
}
