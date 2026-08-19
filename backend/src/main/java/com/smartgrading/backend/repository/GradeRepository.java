package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.Grade; import org.springframework.data.jpa.repository.JpaRepository;
public interface GradeRepository extends JpaRepository<Grade, Long> {}
