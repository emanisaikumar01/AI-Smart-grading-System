package com.smartgrading.backend.entity;
import jakarta.persistence.Entity;
@Entity public class LoginHistory extends BaseEntity { private String username; private java.time.Instant loggedInAt = java.time.Instant.now(); }
