package com.smartgrading.backend.entity;
import jakarta.persistence.Entity;
@Entity public class Rubric extends BaseEntity { private String criteria; private Integer weight; }
