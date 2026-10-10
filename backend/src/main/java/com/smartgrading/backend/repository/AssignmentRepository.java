package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.Assignment; import org.springframework.data.jpa.repository.*; import org.springframework.data.repository.query.Param; import java.util.List;
public interface AssignmentRepository extends JpaRepository<Assignment,Integer> {
 List<Assignment> findByClassEntityId(Integer classId);
 List<Assignment> findByClassEntityProfessorId(Integer professorId);
 @Query("select a from Assignment a where a.classEntity.id in (select cs.id.classId from ClassStudent cs where cs.id.studentId=:studentId)") List<Assignment> findVisibleToStudent(@Param("studentId") Integer studentId);
}
