package com.smartgrading.backend.entity;
import jakarta.persistence.Entity;
@Entity public class PasswordResetToken extends BaseEntity { private String token; private java.time.Instant expiresAt; }
