package com.library.dto;

import com.library.entity.Role;
import com.library.entity.User;
import java.util.UUID;

public class UserResponse {
    public UUID id;
    public String name;
    public String email;
    public Role role;
    public boolean isActive;

    public static UserResponse from(User user) {
        UserResponse dto = new UserResponse();
        dto.id = user.id;
        dto.name = user.name;
        dto.email = user.email;
        dto.role = user.role;
        dto.isActive = user.isActive;
        return dto;
    }
}
