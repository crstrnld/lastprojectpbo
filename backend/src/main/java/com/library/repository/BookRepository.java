package com.library.repository;

import com.library.entity.Book;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class BookRepository implements PanacheRepositoryBase<Book, UUID> {

    public List<Book> search(String query) {
        if (query == null || query.isBlank()) {
            return listAll(Sort.by("title"));
        }
        String like = "%" + query.toLowerCase() + "%";
        return find("lower(title) like ?1 or lower(author) like ?1", Sort.by("title"), like).list();
    }
}
