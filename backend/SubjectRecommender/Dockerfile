# Stage 1: Build the application using Gradle Wrapper
FROM gradle:8.8-jdk22 AS builder

WORKDIR /app

# Copy entire source code to the container
COPY . .

# Ensure gradlew has execute permission
RUN chmod +x gradlew
RUN apt-get update && apt-get install -y dos2unix && dos2unix gradlew
RUN find ./ -name "*.java" | xargs dos2unix
# Build the application (skip tests for faster build)
RUN ./gradlew build -x test
RUN ls -l /app/build/libs/

# Stage 2: Runtime image
FROM openjdk:22-jdk-slim

WORKDIR /app

# Copy the built JAR file from the builder stage
COPY --from=builder /app/build/libs/app-0.0.1-SNAPSHOT.jar app.jar

# Expose port (optional, if you use port like 8080)
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
#ENTRYPOINT ["sh", "-c", "java -Dserver.port=$PORT -Dspring.profiles.active=$SPRING_PROFILES_ACTIVE -jar app.jar"]