package com.smartgrading.backend.dto;
import com.smartgrading.backend.entity.AiEvaluation; import java.math.BigDecimal; import java.time.LocalDateTime;
public record EvaluationResponse(Integer id,Integer answerId,BigDecimal aiScore,BigDecimal confidenceScore,String evaluation,String feedback,LocalDateTime evaluatedAt) { public static EvaluationResponse from(AiEvaluation e){return new EvaluationResponse(e.getId(),e.getAnswer().getId(),e.getAiScore(),e.getConfidenceScore(),e.getEvaluation(),e.getAiFeedback(),e.getEvaluatedAt());} }
