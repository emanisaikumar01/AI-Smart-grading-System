package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.Submission; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface SubmissionRepository extends JpaRepository<Submission,Integer> { List<Submission> findByAssignmentId(Integer assignmentId); List<Submission> findByStudentId(Integer studentId); boolean existsByAssignmentIdAndStudentId(Integer assignmentId,Integer studentId); }
