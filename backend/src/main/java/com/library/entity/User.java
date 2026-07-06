package com.library.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    public UUID id;

    @NotBlank
    @Column(name = "name", nullable = false)
    public String name;

    @NotBlank
    @Email
    @Column(name = "email", nullable = false, unique = true)
    public String email;

    // BCrypt hash - never expose in DTOs
    @NotBlank
    @Column(name = "password", nullable = false)
    public String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    public Role role = Role.USER;

    @Column(name = "is_active", nullable = false)
    public boolean isActive = true;

    public static User findByEmail(String email) {
        return find("email", email).firstResult();
    }
}
