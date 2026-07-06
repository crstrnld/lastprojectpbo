package com.library.repository;

import com.library.entity.User;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.UUID;

@ApplicationScoped
public class UserRepository implements PanacheRepositoryBase<User, UUID> {

    public User findByEmail(String email) {
        return find("email", email).firstResult();
    }

    public boolean existsByEmail(String email) {
        return count("email", email) > 0;
    }
}
