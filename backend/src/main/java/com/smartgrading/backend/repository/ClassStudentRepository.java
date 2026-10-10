package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface ClassStudentRepository extends JpaRepository<ClassStudent,ClassStudentId> { List<ClassStudent> findByStudentId(Integer studentId); List<ClassStudent> findByClassEntityId(Integer classId); }
