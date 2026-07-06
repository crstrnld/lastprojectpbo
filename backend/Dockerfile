# ============================================================
# Stage 1 — Build the Quarkus application with Maven
# ============================================================
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /workspace

# Copy only the POM first so dependency downloads are cached
# as a separate Docker layer (speeds up rebuilds when only
# source code changes).
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# ============================================================
# Stage 2 — Run the built application on a slim JRE
# ============================================================
FROM eclipse-temurin:20-jre-alpine

WORKDIR /app

# Quarkus fast-jar layout (target/quarkus-app) copied layer by layer
# so unchanged dependency layers stay cached between builds.
COPY --from=build /workspace/target/quarkus-app/lib/ ./lib/
COPY --from=build /workspace/target/quarkus-app/*.jar ./
COPY --from=build /workspace/target/quarkus-app/app/ ./app/
COPY --from=build /workspace/target/quarkus-app/quarkus/ ./quarkus/

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "quarkus-run.jar"]
