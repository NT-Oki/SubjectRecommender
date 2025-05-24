# Dùng JDK 21 làm base image
FROM openjdk:21-jdk-slim

# Thư mục làm việc trong container
WORKDIR /app

# Copy file jar (bạn build jar rồi mới copy)
COPY target/*.jar app.jar

# Expose port 8080 (port mặc định Spring Boot)
EXPOSE 8080

# Lệnh chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
