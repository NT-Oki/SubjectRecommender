# Giai đoạn build
FROM gradle:8.7-jdk21 AS builder

WORKDIR /app

COPY . .

# Cho phép thực thi file gradlew nếu cần
RUN chmod +x ./gradlew

# Build project, bỏ qua test
RUN ./gradlew build -x test

# Giai đoạn runtime
FROM openjdk:21-jdk-slim

WORKDIR /app

# Copy file jar đã build
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
