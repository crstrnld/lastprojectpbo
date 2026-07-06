package com.library.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class BookRequest {
    @NotBlank
    public String title;

    @NotBlank
    public String author;

    public String coverImage;

    @Min(0)
    public int availableCopies;
}
