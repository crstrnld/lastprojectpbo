package com.library.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class BorrowRequest {
    @NotNull
    public UUID bookId;

    // Optional - defaults to 14 days from now if not provided
    public Integer loanDays;
}
