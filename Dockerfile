# =========================
# Stage 1: Build ứng dụng
FROM eclipse-temurin:17-jdk AS builder

WORKDIR /workspace

# Copy các file cần thiết trước để tận dụng cache
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Tránh lỗi quyền thực thi trên Linux
RUN chmod +x mvnw

# Kéo dependency trước để cache tốt hơn
RUN ./mvnw -B -q dependency:go-offline

# Copy mã nguồn và build (bỏ test khi build image)
COPY src src
RUN ./mvnw -B -q clean package -DskipTests


# =========================
# Stage 2: Runtime gọn nhẹ
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy file jar đã build từ stage builder
# Spring Boot plugin sẽ tạo duy nhất một file jar trong target
COPY --from=builder /workspace/target/*.jar /app/app.jar

# Biến môi trường hữu ích khi deploy
ENV JAVA_OPTS=""
ENV SPRING_PROFILES_ACTIVE="prod"

# Expose cổng 8080 (mặc định Spring Boot)
EXPOSE 8080

# Lệnh khởi động ứng dụng
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]