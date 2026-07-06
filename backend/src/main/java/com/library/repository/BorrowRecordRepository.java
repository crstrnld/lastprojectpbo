package com.library.repository;

import com.library.entity.Book;
import com.library.entity.BorrowRecord;
import com.library.entity.BorrowStatus;
import com.library.entity.User;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class BorrowRecordRepository implements PanacheRepositoryBase<BorrowRecord, UUID> {

    public List<BorrowRecord> findByUser(User user) {
        return find("user", Sort.by("borrowDate").descending(), user).list();
    }

    public List<BorrowRecord> findActiveByUserAndBook(User user, Book book) {
        return find("user = ?1 and book = ?2 and status = ?3", user, book, BorrowStatus.BORROWED).list();
    }

    public List<BorrowRecord> findAllActive() {
        return find("status", BorrowStatus.BORROWED).list();
    }
}
