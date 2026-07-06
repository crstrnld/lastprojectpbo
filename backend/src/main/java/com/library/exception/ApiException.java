package com.library.exception;

import jakarta.ws.rs.core.Response;

public class ApiException extends RuntimeException {
    public final Response.Status status;

    public ApiException(Response.Status status, String message) {
        super(message);
        this.status = status;
    }
}
