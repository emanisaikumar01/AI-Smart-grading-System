package com.smartgrading.backend.entity;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime;
@Entity @Table(name="subjects") @Getter @Setter @NoArgsConstructor
public class Subject {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="subject_id") private Integer id;
 @Column(name="subject_name",nullable=false,length=150) private String name;
 @Column(columnDefinition="TEXT") private String description;
 @Column(name="created_at",columnDefinition="TIMESTAMP",insertable=false,updatable=false) private LocalDateTime createdAt;
}
