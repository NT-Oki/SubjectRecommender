# Giai đoạn build
FROM gradle:8.7-jdk21 AS builder

WORKDIR /app
COPY --chown=gradle:gradle . .

RUN gradle build -x test

# Giai đoạn runtime
FROM openjdk:21-jdk-slim
WORKDIR /app/backend/SubjectRecommender

COPY --from=builder /app/backend/SubjectRecommender/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
