package com.smartgrading.backend.dto;
import com.smartgrading.backend.entity.*; import java.math.BigDecimal; import java.time.LocalDateTime;
public record AssignmentResponse(Integer id,Integer classId,String title,String description,String instructions,BigDecimal totalMarks,LocalDateTime dueDate,AssignmentStatus status) { public static AssignmentResponse from(Assignment a) { return new AssignmentResponse(a.getId(),a.getClassEntity().getId(),a.getTitle(),a.getDescription(),a.getInstructions(),a.getTotalMarks(),a.getDueDate(),a.getStatus()); } }
