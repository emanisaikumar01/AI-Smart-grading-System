package com.smartgrading.backend.entity;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime;
@Entity @Table(name="student_answers",uniqueConstraints=@UniqueConstraint(columnNames={"submission_id","question_id"})) @Getter @Setter @NoArgsConstructor
public class StudentAnswer {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="answer_id") private Integer id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="submission_id",nullable=false) private Submission submission;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="question_id",nullable=false) private Question question;
 @Column(name="answer_text",columnDefinition="TEXT") private String answerText;
 @Column(name="submitted_at",columnDefinition="TIMESTAMP",insertable=false,updatable=false) private LocalDateTime submittedAt;
}
