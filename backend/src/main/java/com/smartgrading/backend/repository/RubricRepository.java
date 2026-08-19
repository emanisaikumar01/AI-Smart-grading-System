package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.Rubric; import org.springframework.data.jpa.repository.JpaRepository;
public interface RubricRepository extends JpaRepository<Rubric, Long> {}
