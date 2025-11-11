package com.vanh.CourseWeb.configurations;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// Setup cloudinary
@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dxb2de8kl",
                "api_key", "422359278134385",
                "api_secret", "j44mDYChDJ6sN1jOQxxWLI-dOgY",
                "secure", true
        ));
    }
}
