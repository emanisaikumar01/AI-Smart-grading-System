package com.smartgrading.backend.dto;
import com.smartgrading.backend.entity.ClassEntity;
public record ClassResponse(Integer id,String name,String section,Integer subjectId,Integer professorId) { public static ClassResponse from(ClassEntity c) { return new ClassResponse(c.getId(),c.getName(),c.getSection(),c.getSubject().getId(),c.getProfessor().getId()); } }
