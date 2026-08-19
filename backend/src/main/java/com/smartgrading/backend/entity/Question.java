package com.smartgrading.backend.entity;
import jakarta.persistence.Entity;
@Entity public class Question extends BaseEntity { private String prompt; private Integer maxMarks; }
