package com.library.service;

import com.library.dto.BorrowRequest;
import com.library.entity.Book;
import com.library.entity.BorrowRecord;
import com.library.entity.BorrowStatus;
import com.library.entity.User;
import com.library.exception.ApiException;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class BorrowService {

    private static final int DEFAULT_LOAN_DAYS = 14;

    @Inject
    BorrowRecordRepository borrowRecordRepository;

    @Inject
    BookRepository bookRepository;

    @Transactional
    public BorrowRecord borrowBook(User user, BorrowRequest request) {
        Book book = bookRepository.findById(request.bookId);
        if (book == null) {
            throw new ApiException(Response.Status.NOT_FOUND, "Book not found");
        }
        if (book.availableCopies <= 0) {
            throw new ApiException(Response.Status.CONFLICT, "No copies of this book are currently available");
        }
        if (!borrowRecordRepository.findActiveByUserAndBook(user, book).isEmpty()) {
            throw new ApiException(Response.Status.CONFLICT, "You already have an active loan for this book");
        }

        book.availableCopies -= 1;

        int loanDays = request.loanDays != null && request.loanDays > 0 ? request.loanDays : DEFAULT_LOAN_DAYS;

        BorrowRecord record = new BorrowRecord();
        record.user = user;
        record.book = book;
        record.status = BorrowStatus.BORROWED;
        record.borrowDate = LocalDate.now();
        record.dueDate = LocalDate.now().plusDays(loanDays);
        borrowRecordRepository.persist(record);
        return record;
    }

    @Transactional
    public BorrowRecord returnBook(User user, UUID recordId, boolean isStaff) {
        BorrowRecord record = borrowRecordRepository.findById(recordId);
        if (record == null) {
            throw new ApiException(Response.Status.NOT_FOUND, "Borrow record not found");
        }
        if (!isStaff && !record.user.id.equals(user.id)) {
            throw new ApiException(Response.Status.FORBIDDEN, "You cannot return a book borrowed by another user");
        }
        if (record.status == BorrowStatus.RETURNED) {
            throw new ApiException(Response.Status.CONFLICT, "This book has already been returned");
        }

        record.status = BorrowStatus.RETURNED;
        record.returnDate = LocalDate.now();
        record.book.availableCopies += 1;
        return record;
    }

    public List<BorrowRecord> history(User user) {
        return borrowRecordRepository.findByUser(user);
    }

    public List<BorrowRecord> allActive() {
        return borrowRecordRepository.findAllActive();
    }

    /**
     * Marks any BORROWED record whose due date has passed as OVERDUE.
     * Safe to call on read paths since it only tightens the status.
     */
    @Transactional
    public void refreshOverdueStatuses() {
        List<BorrowRecord> active = borrowRecordRepository.findAllActive();
        LocalDate today = LocalDate.now();
        for (BorrowRecord record : active) {
            if (record.dueDate.isBefore(today)) {
                record.status = BorrowStatus.OVERDUE;
            }
        }
    }
}
