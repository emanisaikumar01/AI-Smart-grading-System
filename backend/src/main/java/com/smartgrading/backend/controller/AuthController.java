package com.smartgrading.backend.controller;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") public class AuthController { @GetMapping("/health") public java.util.Map<String,String> health(){ return java.util.Map.of("status", "ok"); } }
