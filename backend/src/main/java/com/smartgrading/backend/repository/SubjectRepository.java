package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.Subject; import org.springframework.data.jpa.repository.JpaRepository;
public interface SubjectRepository extends JpaRepository<Subject,Integer> { boolean existsByName(String name); }
