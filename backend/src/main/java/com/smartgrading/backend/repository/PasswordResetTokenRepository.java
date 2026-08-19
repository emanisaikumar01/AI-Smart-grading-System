package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.PasswordResetToken; import org.springframework.data.jpa.repository.JpaRepository;
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {}
