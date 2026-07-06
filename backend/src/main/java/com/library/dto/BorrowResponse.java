package com.library.dto;

import com.library.entity.BorrowRecord;
import com.library.entity.BorrowStatus;
import java.time.LocalDate;
import java.util.UUID;

public class BorrowResponse {
    public UUID id;
    public UserResponse user;
    public BookResponse book;
    public BorrowStatus status;
    public LocalDate borrowDate;
    public LocalDate dueDate;
    public LocalDate returnDate;

    public static BorrowResponse from(BorrowRecord record) {
        BorrowResponse dto = new BorrowResponse();
        dto.id = record.id;
        dto.user = UserResponse.from(record.user);
        dto.book = BookResponse.from(record.book);
        dto.status = record.status;
        dto.borrowDate = record.borrowDate;
        dto.dueDate = record.dueDate;
        dto.returnDate = record.returnDate;
        return dto;
    }
}
