package com.smartgrading.backend.entity;
import jakarta.persistence.*; import lombok.*; import java.math.BigDecimal; import java.time.LocalDateTime;
@Entity @Table(name="grades") @Getter @Setter @NoArgsConstructor
public class Grade {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="grade_id") private Integer id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="answer_id",nullable=false) private StudentAnswer answer;
 @Column(name="ai_score",precision=6,scale=2) private BigDecimal aiScore; @Column(name="teacher_score",precision=6,scale=2) private BigDecimal teacherScore;
 @Column(name="final_score",precision=6,scale=2) private BigDecimal finalScore;
 @Column(name="teacher_feedback",columnDefinition="TEXT") private String teacherFeedback;
 @Column(name="is_overridden") private Boolean overridden=false;
 @Column(name="graded_at",columnDefinition="TIMESTAMP",insertable=false,updatable=false) private LocalDateTime gradedAt;
}
