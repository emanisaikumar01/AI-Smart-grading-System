package com.smartgrading.backend.repository;
import com.smartgrading.backend.entity.LoginHistory; import org.springframework.data.jpa.repository.JpaRepository;
public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {}
