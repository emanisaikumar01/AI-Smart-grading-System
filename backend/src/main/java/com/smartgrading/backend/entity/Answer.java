package com.smartgrading.backend.entity;
import jakarta.persistence.*;
@Entity public class Answer extends BaseEntity { @Lob private String content; }
