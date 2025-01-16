# Invoice-Management-System-SpringBoot-MicroServices

This project is a study project that demonstrates a microservices-based architecture using Spring Boot and Docker. The system is containerized using Docker Compose, which orchestrates multiple services for an invoice management system.

## Project Structure

### Services Overview
1. **Eureka Discovery Service**:
   - Acts as the service registry to enable service discovery.
   - Accessible on port `8761`.

2. **Gateway Service**:
   - Acts as the API Gateway for routing requests to the appropriate services.
   - Accessible on port `8888`.

3. **Auth Service**:
   - Manages authentication and user data.
   - Accessible on port `8081`.
   - Uses a PostgreSQL database `auth_db`.

4. **Client Service**:
   - Handles client data management.
   - Accessible on port `8082`.
   - Uses a PostgreSQL database `client_db`.

5. **Product Service**:
   - Manages product data.
   - Accessible on port `8083`.
   - Uses a PostgreSQL database `product_db`.

6. **Invoice Service**:
   - Handles invoice generation and management.
   - Accessible on port `8084`.
   - Uses a PostgreSQL database `invoice_db`.

7. **Frontend UI**:
   - Provides a user interface for interacting with the system.
   - Accessible on port `4200`.

## Docker Compose Configuration

The following Docker Compose configuration is used to define the services:

```yaml
docker-compose:
  version: '3.8'

  services:
    # Eureka Discovery Service
    eureka-service:
      build:
        context: ./eureka-discovery-service
        dockerfile: Dockerfile
      ports:
        - "8761:8761"
      healthcheck:
        test: ["CMD", "curl", "-f", "http://localhost:8761"]
        interval: 30s
        timeout: 10s
        retries: 5

    # Gateway Service
    gateway-service:
      build:
        context: ./gateway-service
        dockerfile: Dockerfile
      ports:
        - "8888:8888"
      depends_on:
        eureka-service:
          condition: service_healthy
      environment:
        - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-service:8761/eureka/

    # Auth Service
    auth-service:
      build:
        context: ./auth-service
        dockerfile: Dockerfile
      ports:
        - "8081:8081"
      depends_on:
        eureka-service:
          condition: service_healthy
      environment:
        - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-service:8761/eureka/
        - SPRING_DATASOURCE_URL=jdbc:postgresql://auth-db:5432/auth_db
      links:
        - auth-db

    # Auth Database
    auth-db:
      image: postgres:14-alpine
      environment:
        - POSTGRES_DB=auth_db
        - POSTGRES_USER=postgres
        - POSTGRES_PASSWORD=postgres
      volumes:
        - auth_data:/var/lib/postgresql/data

    # Client Service
    client-service:
      build:
        context: ./client-service
        dockerfile: Dockerfile
      ports:
        - "8082:8082"
      depends_on:
        eureka-service:
          condition: service_healthy
      environment:
        - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-service:8761/eureka/
        - SPRING_DATASOURCE_URL=jdbc:postgresql://client-db:5432/client_db
      links:
        - client-db

    # Client Database
    client-db:
      image: postgres:14-alpine
      environment:
        - POSTGRES_DB=client_db
        - POSTGRES_USER=postgres
        - POSTGRES_PASSWORD=postgres
      volumes:
        - client_data:/var/lib/postgresql/data

    # Product Service
    produit-service:
      build:
        context: ./produit-service
        dockerfile: Dockerfile
      ports:
        - "8083:8083"
      depends_on:
        eureka-service:
          condition: service_healthy
      environment:
        - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-service:8761/eureka/
        - SPRING_DATASOURCE_URL=jdbc:postgresql://product-db:5432/product_db
      links:
        - product-db

    # Product Database
    product-db:
      image: postgres:14-alpine
      environment:
        - POSTGRES_DB=product_db
        - POSTGRES_USER=postgres
        - POSTGRES_PASSWORD=postgres
      volumes:
        - product_data:/var/lib/postgresql/data

    # Invoice Service
    facture-service:
      build:
        context: ./facture-service
        dockerfile: Dockerfile
      ports:
        - "8084:8084"
      depends_on:
        eureka-service:
          condition: service_healthy
      environment:
        - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-service:8761/eureka/
        - SPRING_DATASOURCE_URL=jdbc:postgresql://invoice-db:5432/invoice_db
      links:
        - invoice-db

    # Invoice Database
    invoice-db:
      image: postgres:14-alpine
      environment:
        - POSTGRES_DB=invoice_db
        - POSTGRES_USER=postgres
        - POSTGRES_PASSWORD=postgres
      volumes:
        - invoice_data:/var/lib/postgresql/data

    # Frontend UI
    frontend:
      build:
        context: ./invoice-management-ui
        dockerfile: Dockerfile
      ports:
        - "4200:80"
      depends_on:
        - gateway-service

  volumes:
    auth_data:
    client_data:
    product_data:
    invoice_data:
```

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/ghabianis/Invoice-Mangement-System-SpringBoot-MicroServices.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Invoice-Mangement-System-SpringBoot-MicroServices
   ```

3. Start the services using Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Access the services using the following ports:
   - Eureka Discovery Service: `http://localhost:8761`
   - Gateway Service: `http://localhost:8888`
   - Frontend UI: `http://localhost:4200`

## Features
- Service discovery with Eureka.
- Centralized API Gateway.
- Authentication and authorization.
- Modular architecture with microservices for clients, products, and invoices.
- Containerized environment for easy deployment.

## Technologies Used
- Spring Boot
- Docker & Docker Compose
- PostgreSQL
- Angular (Frontend)
- Eureka for service discovery

@Created By:
@AnisGhabi @FawziAbdellaoui @SirineTrabelsi
