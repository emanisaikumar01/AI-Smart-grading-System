package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.Grade; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface GradeRepository extends JpaRepository<Grade,Integer> { List<Grade> findByAnswerId(Integer answerId); List<Grade> findByAnswerIdOrderByIdDesc(Integer answerId); boolean existsByAnswerId(Integer answerId); }
