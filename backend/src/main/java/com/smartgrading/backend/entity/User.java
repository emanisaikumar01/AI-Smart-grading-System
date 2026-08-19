package com.smartgrading.backend.entity;
import jakarta.persistence.*;
@Entity @Table(name = "users")
public class User extends BaseEntity { @Column(nullable = false, unique = true) private String email; private String passwordHash; private String role; public String getEmail(){return email;} public void setEmail(String email){this.email=email;} public String getPasswordHash(){return passwordHash;} public void setPasswordHash(String value){passwordHash=value;} }
