# Stone and Sod CRM

This is a web application for lawn maintenance businesses, built with Next.js (App Router), a Node.js/Express.js API, and PostgreSQL, all orchestrated with Docker.

## Features

- User Roles: Admin, Manager, Crew Lead, Employee.
- Modules: My Day, KPI Dashboard, Customers, Team, Resources, Equipment, Finances, Reports.
- Comprehensive data models for customers, properties, jobs, employees, inventory, equipment, invoices, and more.

## Getting Started

### Prerequisites

- Docker Desktop (or Docker Engine and Docker Compose) installed on your system.

### Setup and Run

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd Stone-and-Sod-CRM
    ```

2.  **Build and start the Docker containers:**

    This command will build the Docker images for the API and Next.js app, create the PostgreSQL database, and start all services.

    ```bash
    docker-compose up --build -d
    ```

    *   The database schema will be automatically applied on the first run via `schema.sql`.

3.  **Verify services are running:**

    You can check the logs for each service to ensure they started without errors:

    ```bash
    docker-compose logs db
    docker-compose logs api
    docker-compose logs nextjs-app
    ```

4.  **Access the application:**

    -   **Next.js App (Frontend):** Open your web browser and navigate to `http://localhost:3000`
    -   **API (Backend):** The API will be running on `http://localhost:3001`. You can test it by visiting `http://localhost:3001/` in your browser, which should return a success message if the API is running.

## Project Structure

-   `docker-compose.yml`: Defines the multi-service Docker environment.
-   `Dockerfile.api`: Dockerfile for the Node.js/Express.js API.
-   `Dockerfile.nextjs`: Dockerfile for the Next.js frontend application.
-   `schema.sql`: PostgreSQL database schema definition (simplified for single-company use).
-   `api/`: Contains the Node.js/Express.js API source code.
    -   `server.js`: API entry point with simplified user management (no company-specific logic).
-   `app/`: Contains the Next.js application source code (App Router).
    -   `layout.tsx`, `page.tsx`, `globals.css`: Core Next.js files.
    -   `src/app/api/`: API routes for Next.js (if used for internal API).
    -   `src/components/`: React components (auth, ui, etc.).
    -   `src/lib/`: Utility functions and libraries.
    -   `src/styles/`: Global styles.
-   `package.json`: Consolidated application dependencies.
-   `tsconfig.json`: TypeScript configuration for Next.js.
-   `next-env.d.ts`: Next.js environment type definitions.

## Next Steps (Development)

-   Implement authentication and authorization logic in the API and Next.js app.
-   Develop API endpoints for each module (Customers, Team, etc.).
-   Build out the Next.js frontend components and pages for each module and tab.
-   Integrate the frontend with the backend API.
-   Add more detailed error handling and logging.
-   Implement testing for both frontend and backend.
