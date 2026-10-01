package com.smartgrading.backend.dto;
import jakarta.validation.constraints.*; import java.math.BigDecimal;
public record QuestionRequest(@NotNull Integer assignmentId,@NotNull @Positive Integer questionNumber,@NotBlank String questionText,@NotNull @DecimalMin("0.01") BigDecimal maxMarks,@Size(max=65535) String expectedAnswer,@Size(max=65535) String markingCriteria) {}
