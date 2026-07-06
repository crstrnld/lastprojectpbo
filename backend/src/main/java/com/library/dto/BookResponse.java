package com.library.dto;

import com.library.entity.Book;
import java.util.UUID;

public class BookResponse {
    public UUID id;
    public String title;
    public String author;
    public String coverImage;
    public int availableCopies;

    public static BookResponse from(Book book) {
        BookResponse dto = new BookResponse();
        dto.id = book.id;
        dto.title = book.title;
        dto.author = book.author;
        dto.coverImage = book.coverImage;
        dto.availableCopies = book.availableCopies;
        return dto;
    }
}
