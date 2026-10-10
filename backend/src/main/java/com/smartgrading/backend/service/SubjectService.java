package com.smartgrading.backend.service;
import com.smartgrading.backend.dto.*; import java.util.List;
public interface SubjectService { SubjectResponse create(SubjectRequest r); List<SubjectResponse> findAll(); SubjectResponse find(Integer id); SubjectResponse update(Integer id,SubjectRequest r); void delete(Integer id); }
