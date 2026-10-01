package com.smartgrading.backend.entity;
import jakarta.persistence.*; import lombok.*; import java.io.Serializable;
@Embeddable @Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
public class ClassStudentId implements Serializable {
 @Column(name="class_id") private Integer classId;
 @Column(name="student_id") private Integer studentId;
}
