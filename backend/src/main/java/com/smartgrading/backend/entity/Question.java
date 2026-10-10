package com.smartgrading.backend.entity;
import jakarta.persistence.*; import lombok.*; import java.math.BigDecimal;
@Entity @Table(name="questions",uniqueConstraints=@UniqueConstraint(columnNames={"assignment_id","question_number"})) @Getter @Setter @NoArgsConstructor
public class Question {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="question_id") private Integer id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="assignment_id",nullable=false) private Assignment assignment;
 @Column(name="question_number",nullable=false) private Integer questionNumber;
 @Column(name="question_text",nullable=false,columnDefinition="TEXT") private String questionText;
 @Column(name="max_marks",nullable=false,precision=6,scale=2) private BigDecimal maxMarks;
 @Column(name="expected_answer",columnDefinition="TEXT") private String expectedAnswer;
 @Column(name="marking_criteria",columnDefinition="TEXT") private String markingCriteria;
}
