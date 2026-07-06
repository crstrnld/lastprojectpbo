package com.library.security;

import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * Wraps BCrypt hashing/verification so the rest of the app never touches
 * a hashing library directly.
 */
@ApplicationScoped
public class PasswordService {

    private static final int COST = 12;

    public String hash(String plainTextPassword) {
        return BcryptUtil.bcryptHash(plainTextPassword, COST);
    }

    public boolean verify(String plainTextPassword, String hashedPassword) {
        return BcryptUtil.matches(plainTextPassword, hashedPassword);
    }
}
