package com.smartgrading.backend.config;

import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class AiGradingClientConfig {
    @Bean
    RestClient aiRestClient(
            @Value("${app.ai.service-url:http://localhost:8501}") String baseUrl,
            @Value("${app.ai.connect-timeout:3s}") Duration connectTimeout,
            @Value("${app.ai.read-timeout:180s}") Duration readTimeout) {
        var factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(connectTimeout);
        factory.setReadTimeout(readTimeout);
        return RestClient.builder().baseUrl(baseUrl).requestFactory(factory).build();
    }
}
