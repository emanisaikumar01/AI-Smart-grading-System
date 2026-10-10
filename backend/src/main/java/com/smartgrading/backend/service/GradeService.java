package com.smartgrading.backend.service;
import com.smartgrading.backend.entity.Grade; import com.smartgrading.backend.dto.GradeUpdateRequest; import java.util.List;
public interface GradeService { List<Grade> byAnswer(Integer answerId); Grade update(Integer answerId,GradeUpdateRequest request); }
