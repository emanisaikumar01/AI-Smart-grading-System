package com.smartgrading.backend.service;
import com.smartgrading.backend.dto.*;
public interface UserService { AuthResponse register(RegisterRequest request); AuthResponse login(LoginRequest request); }
