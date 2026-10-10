package com.smartgrading.backend.dto;
import jakarta.validation.constraints.NotBlank;
public record AnswerUpdateRequest(@NotBlank String answerText) {}
