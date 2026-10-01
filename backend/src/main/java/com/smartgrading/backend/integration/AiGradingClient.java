package com.smartgrading.backend.integration;
import com.smartgrading.backend.dto.EvaluationRequest; import java.math.BigDecimal;
/** HTTP boundary to the existing Python grading implementation. */
public interface AiGradingClient { AiGradingResult grade(EvaluationRequest request); record AiGradingResult(BigDecimal score,BigDecimal confidenceScore,String evaluation,String feedback,BigDecimal similarityScore,Integer keywordsFound,Integer totalKeywords) {} }
