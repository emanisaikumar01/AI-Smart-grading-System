package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.AiEvaluation; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface AiEvaluationRepository extends JpaRepository<AiEvaluation,Integer> { List<AiEvaluation> findByAnswerId(Integer answerId); List<AiEvaluation> findByAnswerIdOrderByIdDesc(Integer answerId); boolean existsByAnswerId(Integer answerId); }
