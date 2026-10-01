package com.smartgrading.backend.dto;
import jakarta.validation.constraints.*; import java.math.BigDecimal;
public record GradeUpdateRequest(BigDecimal aiScore,@DecimalMin("0.00") BigDecimal teacherScore,@DecimalMin("0.00") BigDecimal finalScore,String teacherFeedback,Boolean isOverridden) {}
