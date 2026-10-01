package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.AssignmentFile; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface AssignmentFileRepository extends JpaRepository<AssignmentFile,Integer> { List<AssignmentFile> findByAssignmentId(Integer assignmentId); }
