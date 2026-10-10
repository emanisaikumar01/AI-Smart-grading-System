package com.smartgrading.backend.entity;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime;
@Entity @Table(name="assignment_files") @Getter @Setter @NoArgsConstructor
public class AssignmentFile {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="file_id") private Integer id;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="assignment_id",nullable=false) private Assignment assignment;
 @Column(name="file_name",nullable=false,length=255) private String fileName; @Column(name="file_type",length=100) private String fileType;
 @Column(name="file_path",nullable=false,length=500) private String filePath;
 @Enumerated(EnumType.STRING) @Column(name="file_category",nullable=false,length=30) private FileCategory fileCategory;
 @Column(name="uploaded_at",columnDefinition="TIMESTAMP",insertable=false,updatable=false) private LocalDateTime uploadedAt;
}
