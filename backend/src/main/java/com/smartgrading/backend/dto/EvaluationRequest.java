package com.smartgrading.backend.dto;
import java.math.BigDecimal;
import java.util.List;
public record EvaluationRequest(String questionText,String expectedAnswer,String markingCriteria,String studentAnswer,BigDecimal maxMarks,List<String> keywords) {}
