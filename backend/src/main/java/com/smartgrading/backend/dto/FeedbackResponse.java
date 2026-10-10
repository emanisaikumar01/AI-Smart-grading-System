package com.smartgrading.backend.dto;
import com.smartgrading.backend.entity.*; import java.time.LocalDateTime;
public record FeedbackResponse(Integer id,Integer answerId,String feedbackText,FeedbackType feedbackType,LocalDateTime createdAt) { public static FeedbackResponse from(Feedback f) { return new FeedbackResponse(f.getId(),f.getAnswer().getId(),f.getFeedbackText(),f.getFeedbackType(),f.getCreatedAt()); } }
