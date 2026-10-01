package com.smartgrading.backend.dto;
import com.smartgrading.backend.entity.*; import java.time.LocalDateTime;
public record UserResponse(Integer id,String name,String email,Role role,LocalDateTime createdAt) { public static UserResponse from(User u) { return new UserResponse(u.getId(),u.getName(),u.getEmail(),u.getRole(),u.getCreatedAt()); } }
