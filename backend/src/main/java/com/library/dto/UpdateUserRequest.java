package com.library.dto;

import com.library.entity.Role;

public class UpdateUserRequest {
    public String name;
    public String email;
    public Role role;
    public Boolean isActive;
}
