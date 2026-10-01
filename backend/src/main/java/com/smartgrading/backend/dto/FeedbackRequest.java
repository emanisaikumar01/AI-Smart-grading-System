package com.smartgrading.backend.dto;
import com.smartgrading.backend.entity.FeedbackType; import jakarta.validation.constraints.*;
public record FeedbackRequest(@NotBlank String feedbackText,@NotNull FeedbackType feedbackType) {}
