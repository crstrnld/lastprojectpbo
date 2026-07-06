package com.library.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

@Entity
@Table(name = "books")
public class Book extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    public UUID id;

    @NotBlank
    @Column(name = "title", nullable = false)
    public String title;

    @NotBlank
    @Column(name = "author", nullable = false)
    public String author;

    @Column(name = "cover_image")
    public String coverImage;

    @Min(0)
    @Column(name = "available_copies", nullable = false)
    public int availableCopies;

    public static Book findByTitleOrAuthor(String search) {
        return find("lower(title) like ?1 or lower(author) like ?1",
                "%" + search.toLowerCase() + "%").firstResult();
    }
}
