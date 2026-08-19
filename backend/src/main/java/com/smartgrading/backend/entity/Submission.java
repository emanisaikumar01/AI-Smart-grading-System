package com.smartgrading.backend.entity;
import jakarta.persistence.Entity;
@Entity public class Submission extends BaseEntity { private java.time.Instant submittedAt = java.time.Instant.now(); private String status; }
