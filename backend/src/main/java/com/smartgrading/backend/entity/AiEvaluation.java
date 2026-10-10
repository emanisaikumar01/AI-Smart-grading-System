package com.smartgrading.backend.entity;
import jakarta.persistence.*; import lombok.*; import java.math.BigDecimal; import java.time.LocalDateTime;
@Entity @Table(name="ai_evaluations") @Getter @Setter @NoArgsConstructor
public class AiEvaluation {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="evaluation_id") private Integer id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="answer_id",nullable=false) private StudentAnswer answer;
 @Column(name="ai_score",nullable=false,precision=6,scale=2) private BigDecimal aiScore;
 @Column(name="confidence_score",precision=5,scale=2) private BigDecimal confidenceScore;
 @Column(columnDefinition="TEXT") private String evaluation; @Column(name="ai_feedback",columnDefinition="TEXT") private String aiFeedback;
 @Column(name="evaluated_at",columnDefinition="TIMESTAMP",insertable=false,updatable=false) private LocalDateTime evaluatedAt;
}
