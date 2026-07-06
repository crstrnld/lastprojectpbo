package com.library.service;

import com.library.dto.BookRequest;
import com.library.entity.Book;
import com.library.exception.ApiException;
import com.library.repository.BookRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.util.UUID;

@ApplicationScoped
public class BookService {

    @Inject
    BookRepository bookRepository;

    public java.util.List<Book> search(String query) {
        return bookRepository.search(query);
    }

    public Book findById(UUID id) {
        Book book = bookRepository.findById(id);
        if (book == null) {
            throw new ApiException(Response.Status.NOT_FOUND, "Book not found");
        }
        return book;
    }

    @Transactional
    public Book create(BookRequest request) {
        Book book = new Book();
        book.title = request.title;
        book.author = request.author;
        book.coverImage = request.coverImage;
        book.availableCopies = request.availableCopies;
        bookRepository.persist(book);
        return book;
    }

    @Transactional
    public Book update(UUID id, BookRequest request) {
        Book book = findById(id);
        book.title = request.title;
        book.author = request.author;
        book.coverImage = request.coverImage;
        book.availableCopies = request.availableCopies;
        return book;
    }

    @Transactional
    public void delete(UUID id) {
        Book book = findById(id);
        bookRepository.delete(book);
    }
}
