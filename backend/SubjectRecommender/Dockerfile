# Stage 1: Build
FROM gradle:8.8-jdk22 AS builder

WORKDIR /app

# Copy toàn bộ source code (bao gồm gradlew và gradle wrapper)
COPY . .

# Cấp quyền cho gradlew nếu cần
RUN chmod +x ./gradlew

# Build project (bỏ qua test)
RUN ./gradlew build -x test

# Stage 2: Runtime
FROM openjdk:222-jdk-slim

WORKDIR /app

# Copy file jar từ stage builder vào
COPY --from=builder /app/build/libs/*.jar app.jar

# Lệnh chạy app
ENTRYPOINT ["java", "-jar", "app.jar"]
