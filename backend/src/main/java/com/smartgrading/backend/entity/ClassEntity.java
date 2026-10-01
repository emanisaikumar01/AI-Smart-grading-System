package com.smartgrading.backend.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="classes") @Getter @Setter @NoArgsConstructor
public class ClassEntity {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="class_id") private Integer id;
 @Column(name="class_name",nullable=false,length=100) private String name;
 @Column(length=50) private String section;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="subject_id",nullable=false) private Subject subject;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="professor_id",nullable=false) private User professor;
}
