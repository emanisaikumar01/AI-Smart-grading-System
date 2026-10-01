package com.smartgrading.backend.dto;
import jakarta.validation.constraints.NotNull;
public record SubmissionRequest(String fileName,String filePath) {}
