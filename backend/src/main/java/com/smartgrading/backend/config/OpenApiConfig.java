package com.smartgrading.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean OpenAPI smartGradingOpenApi() { return new OpenAPI().info(new Info().title("AI Smart Grading API").version("v1")); }
}
