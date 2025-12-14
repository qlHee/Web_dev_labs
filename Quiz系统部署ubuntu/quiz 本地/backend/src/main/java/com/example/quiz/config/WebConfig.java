package com.example.quiz.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.Filter;
import javax.servlet.FilterRegistration;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import org.springframework.boot.web.servlet.ServletContextInitializer;

@Configuration
public class WebConfig implements WebMvcConfigurer, ServletContextInitializer {

    @Autowired
    private JwtFilter jwtFilter;

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        FilterRegistration.Dynamic registration = servletContext.addFilter("jwtFilter", jwtFilter);
        registration.addMappingForUrlPatterns(null, false, "/*");
    }
}
