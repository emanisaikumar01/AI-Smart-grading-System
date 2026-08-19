package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.Answer; import org.springframework.data.jpa.repository.JpaRepository;
public interface AnswerRepository extends JpaRepository<Answer, Long> {}
