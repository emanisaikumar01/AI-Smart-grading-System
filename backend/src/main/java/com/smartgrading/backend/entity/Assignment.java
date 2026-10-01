package com.smartgrading.backend.entity;
import jakarta.persistence.*; import lombok.*; import java.math.BigDecimal; import java.time.LocalDateTime;
@Entity @Table(name="assignments") @Getter @Setter @NoArgsConstructor
public class Assignment {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="assignment_id") private Integer id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="class_id",nullable=false) private ClassEntity classEntity;
 @Column(nullable=false,length=200) private String title; @Column(columnDefinition="TEXT") private String description;
 @Column(columnDefinition="TEXT") private String instructions;
 @Column(name="total_marks",nullable=false,precision=6,scale=2) private BigDecimal totalMarks;
 @Column(name="due_date") private LocalDateTime dueDate;
 @Enumerated(EnumType.STRING) @Column(length=20) private AssignmentStatus status=AssignmentStatus.DRAFT;
 @Column(name="created_at",columnDefinition="TIMESTAMP",insertable=false,updatable=false) private LocalDateTime createdAt;
}
