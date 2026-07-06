package com.library.dto;

import jakarta.validation.constraints.Email;

public class UpdateProfileRequest {
    public String name;

    @Email
    public String email;

    // Optional - only set when the user wants to change their password
    public String currentPassword;
    public String newPassword;
}
