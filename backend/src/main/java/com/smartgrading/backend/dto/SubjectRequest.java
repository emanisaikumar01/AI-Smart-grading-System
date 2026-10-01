package com.smartgrading.backend.dto;
import jakarta.validation.constraints.*;
public record SubjectRequest(@NotBlank @Size(max=150) String name, String description) {}
