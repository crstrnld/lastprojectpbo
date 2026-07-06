package com.library.security;

import com.library.entity.User;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.Duration;
import java.util.Set;

/**
 * Generates signed JWTs that encode the user's id, email and role.
 * The role is exposed as a "groups" claim so that @RolesAllowed works
 * out of the box with SmallRye JWT's built-in role mapping.
 */
@ApplicationScoped
public class JwtService {

    public String generateToken(User user) {
        return Jwt.issuer("https://library-management.example.com")
                .subject(user.id.toString())
                .claim("email", user.email)
                .claim("name", user.name)
                .groups(Set.of(user.role.name()))
                .expiresIn(Duration.ofHours(24))
                .sign();
    }
}
