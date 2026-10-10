package com.smartgrading.backend.service;
import com.smartgrading.backend.dto.*; import java.util.List;
public interface QuestionService { QuestionResponse create(QuestionRequest r); QuestionResponse create(Integer assignmentId,QuestionRequest r); List<QuestionResponse> forAssignment(Integer id); QuestionResponse update(Integer id,QuestionRequest r); void delete(Integer id); }
