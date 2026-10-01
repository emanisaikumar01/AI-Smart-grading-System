package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.Question; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface QuestionRepository extends JpaRepository<Question,Integer> { List<Question> findByAssignmentIdOrderByQuestionNumber(Integer assignmentId); boolean existsByAssignmentIdAndQuestionNumber(Integer assignmentId,Integer questionNumber); }
