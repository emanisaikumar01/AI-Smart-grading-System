package com.smartgrading.backend.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="class_students") @Getter @Setter @NoArgsConstructor
public class ClassStudent {
 @EmbeddedId private ClassStudentId id;
 @MapsId("classId") @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="class_id") private ClassEntity classEntity;
 @MapsId("studentId") @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="student_id") private User student;
 public ClassStudent(ClassEntity c, User s) { this.id=new ClassStudentId(c.getId(),s.getId()); this.classEntity=c; this.student=s; }
}
