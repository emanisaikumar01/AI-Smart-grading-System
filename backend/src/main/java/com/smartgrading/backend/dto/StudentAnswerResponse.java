package com.smartgrading.backend.dto;
import com.smartgrading.backend.entity.StudentAnswer; import java.time.LocalDateTime;
public record StudentAnswerResponse(Integer id,Integer submissionId,Integer questionId,String answerText,LocalDateTime submittedAt) { public static StudentAnswerResponse from(StudentAnswer a) { return new StudentAnswerResponse(a.getId(),a.getSubmission().getId(),a.getQuestion().getId(),a.getAnswerText(),a.getSubmittedAt()); } }
