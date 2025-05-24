    package org.example.subjectrecommender.config;

    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.web.servlet.config.annotation.CorsRegistry;
    import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

    @Configuration
    public class WebConfig {

        @Bean
        public WebMvcConfigurer corsConfigurer() {
            return new WebMvcConfigurer() {
                @Override
                public void addCorsMappings(CorsRegistry registry) {
                    registry.addMapping("/**")
                            .allowedOrigins("https://6831ff354451b20008c68ff2--enti-vt.netlify.app")  // địa chỉ React
                            .allowedMethods("GET", "POST", "PUT", "DELETE")
                            .allowCredentials(true);
                }
            };
        }
    }
