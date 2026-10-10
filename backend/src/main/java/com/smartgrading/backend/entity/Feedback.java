package com.smartgrading.backend.entity;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime;
@Entity @Table(name="feedback") @Getter @Setter @NoArgsConstructor
public class Feedback {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="feedback_id") private Integer id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="answer_id",nullable=false) private StudentAnswer answer;
 @Column(name="feedback_text",nullable=false,columnDefinition="TEXT") private String feedbackText;
 @Enumerated(EnumType.STRING) @Column(name="feedback_type",nullable=false,length=20) private FeedbackType feedbackType;
 @Column(name="created_at",columnDefinition="TIMESTAMP",insertable=false,updatable=false) private LocalDateTime createdAt;
}
