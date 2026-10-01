package com.smartgrading.backend.dto;
import com.smartgrading.backend.entity.Role; import jakarta.validation.constraints.*;
public record RegisterRequest(@NotBlank @Size(max=100) String name, @NotBlank @Email @Size(max=150) String email, @NotBlank @Size(min=8,max=72) String password, @NotNull Role role) {}
