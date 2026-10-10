package com.smartgrading.backend.service;
import com.smartgrading.backend.dto.EvaluationResponse; import com.smartgrading.backend.entity.AiEvaluation; import java.util.List;
public interface EvaluationService { List<AiEvaluation> byAnswer(Integer answerId); List<EvaluationResponse> evaluateSubmission(Integer submissionId); }
