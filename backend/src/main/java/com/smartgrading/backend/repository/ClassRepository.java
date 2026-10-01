package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.ClassEntity; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface ClassRepository extends JpaRepository<ClassEntity,Integer> { List<ClassEntity> findByProfessorId(Integer professorId); }
