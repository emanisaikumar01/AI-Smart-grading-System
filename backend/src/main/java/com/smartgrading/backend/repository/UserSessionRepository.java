package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.UserSession; import org.springframework.data.jpa.repository.JpaRepository;
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {}
