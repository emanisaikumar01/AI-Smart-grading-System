package com.smartgrading.backend.dto;
import com.smartgrading.backend.entity.Question; import java.math.BigDecimal;
public record QuestionResponse(Integer id,Integer assignmentId,Integer questionNumber,String questionText,BigDecimal maxMarks,String expectedAnswer,String markingCriteria) { public static QuestionResponse from(Question q) { return new QuestionResponse(q.getId(),q.getAssignment().getId(),q.getQuestionNumber(),q.getQuestionText(),q.getMaxMarks(),q.getExpectedAnswer(),q.getMarkingCriteria()); } }
