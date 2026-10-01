package com.smartgrading.backend.dto;
import jakarta.validation.constraints.*; import java.math.BigDecimal; import java.time.LocalDateTime;
public record AssignmentRequest(@NotNull Integer classId,@NotBlank @Size(max=200) String title,String description,String instructions,@NotNull @DecimalMin("0.01") BigDecimal totalMarks,LocalDateTime dueDate) {}
