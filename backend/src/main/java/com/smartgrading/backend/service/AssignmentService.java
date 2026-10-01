package com.smartgrading.backend.service;
import com.smartgrading.backend.dto.*; import java.util.List;
public interface AssignmentService { AssignmentResponse create(AssignmentRequest r); List<AssignmentResponse> all(); AssignmentResponse get(Integer id); AssignmentResponse update(Integer id,AssignmentRequest r); void delete(Integer id); AssignmentResponse publish(Integer id); AssignmentResponse close(Integer id); }
