package com.smartgrading.backend.dto;
import jakarta.validation.constraints.NotNull;
public record StudentAnswerRequest(@NotNull Integer questionId,String answerText) {}
