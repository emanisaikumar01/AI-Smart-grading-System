package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.Assignment; import org.springframework.data.jpa.repository.JpaRepository;
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {}
