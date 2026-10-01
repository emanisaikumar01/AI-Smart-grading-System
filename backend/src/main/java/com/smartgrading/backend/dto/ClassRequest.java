package com.smartgrading.backend.dto;
import jakarta.validation.constraints.*;
public record ClassRequest(@NotBlank @Size(max=100) String name,@Size(max=50) String section,@NotNull Integer subjectId) {}
