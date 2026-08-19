package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.Submission; import org.springframework.data.jpa.repository.JpaRepository;
public interface SubmissionRepository extends JpaRepository<Submission, Long> {}
