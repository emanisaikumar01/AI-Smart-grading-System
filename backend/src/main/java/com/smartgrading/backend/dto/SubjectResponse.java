package com.smartgrading.backend.dto;
import com.smartgrading.backend.entity.Subject;
public record SubjectResponse(Integer id,String name,String description) { public static SubjectResponse from(Subject s) { return new SubjectResponse(s.getId(),s.getName(),s.getDescription()); } }
