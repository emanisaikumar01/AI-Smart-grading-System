package com.smartgrading.backend.service;
import com.smartgrading.backend.dto.*; import java.util.List;
public interface ClassService { ClassResponse create(ClassRequest r); List<ClassResponse> all(); ClassResponse get(Integer id); ClassResponse update(Integer id,ClassRequest r); void delete(Integer id); List<UserResponse> students(Integer id); void addStudent(Integer classId,Integer studentId); void removeStudent(Integer classId,Integer studentId); }
