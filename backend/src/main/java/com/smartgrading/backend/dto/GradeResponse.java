package com.smartgrading.backend.dto;
import com.smartgrading.backend.entity.Grade; import java.math.BigDecimal;
public record GradeResponse(Integer id,Integer answerId,BigDecimal aiScore,BigDecimal teacherScore,BigDecimal finalScore,String teacherFeedback,Boolean overridden) { public static GradeResponse from(Grade g) { return new GradeResponse(g.getId(),g.getAnswer().getId(),g.getAiScore(),g.getTeacherScore(),g.getFinalScore(),g.getTeacherFeedback(),g.getOverridden()); } }
