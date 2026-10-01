package com.smartgrading.backend.entity;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime;
@Entity @Table(name="submissions",uniqueConstraints=@UniqueConstraint(columnNames={"assignment_id","student_id"})) @Getter @Setter @NoArgsConstructor
public class Submission {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="submission_id") private Integer id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="assignment_id",nullable=false) private Assignment assignment;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="student_id",nullable=false) private User student;
 @Column(name="file_name",length=255) private String fileName; @Column(name="file_path",length=500) private String filePath;
 @Column(name="submitted_at",columnDefinition="TIMESTAMP",insertable=false,updatable=false) private LocalDateTime submittedAt;
 @Enumerated(EnumType.STRING) @Column(length=20) private SubmissionStatus status=SubmissionStatus.SUBMITTED;
}
