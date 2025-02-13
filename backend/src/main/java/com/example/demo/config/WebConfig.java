package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*") // Zezwalamy na wszystkie domeny (tylko do testów!)
                .allowedMethods("*") // Zezwalamy na wszystkie metody (tylko do testów!)
                .allowedHeaders("*"); // Zezwalamy na wszystkie nagłówki (tylko do testów!)
    }
}
