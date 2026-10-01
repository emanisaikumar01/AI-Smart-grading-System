package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.Feedback; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface FeedbackRepository extends JpaRepository<Feedback,Integer> { List<Feedback> findByAnswerId(Integer answerId); }
