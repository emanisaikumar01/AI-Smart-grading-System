package com.smartgrading.backend.dto;
import com.smartgrading.backend.entity.*; import java.time.LocalDateTime;
public record SubmissionResponse(Integer id,Integer assignmentId,Integer studentId,String fileName,String filePath,LocalDateTime submittedAt,SubmissionStatus status) { public static SubmissionResponse from(Submission s) { return new SubmissionResponse(s.getId(),s.getAssignment().getId(),s.getStudent().getId(),s.getFileName(),s.getFilePath(),s.getSubmittedAt(),s.getStatus()); } }
