# Stone and Sod CRM

This is a web application for Stone and Sod Pros, a lawn maintenance business. It's built with Next.js (App Router), a Node.js/Express.js API, and PostgreSQL, all orchestrated with Docker. This version is simplified for a single-company use case.

## Features

- Single-company application (Stone and Sod Pros).
- User Roles: Admin, Manager, Crew Lead, Employee.
- Modules: My Day, KPI Dashboard, Customers, Team, Resources, Equipment, Finances, Reports (future development).
- Comprehensive data models for customers, properties, jobs, employees, inventory, equipment, invoices, and more (future development).

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

3.  **Initial Admin Setup:**

    Since there is no registration flow, you need to manually create the initial admin user in the database.

    a.  **Get the PostgreSQL container name:**
        ```bash
        docker ps --filter "name=db" --format "{{.Names}}"
        ```
        (e.g., `stone-and-sod-crm-db-1`)

    b.  **Enable `pgcrypto` extension (if not already enabled):**
        ```bash
        docker exec <your-db-container-name> psql -U user -d stone_sod_crm -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
        ```

    c.  **Insert the admin user:**
        ```bash
        docker exec <your-db-container-name> psql -U user -d stone_sod_crm -c "INSERT INTO users (username, password, role, status) VALUES ('admin', crypt('admin', gen_salt('bf')), 'admin', 'active');"
        ```
        This creates an admin user with username `admin` and password `admin`.

4.  **Access the application:**

    -   **Next.js App (Frontend):** Open your web browser and navigate to `http://localhost:3000`
    -   **API (Backend):** The API will be running on `http://localhost:3001`. You can test it by visiting `http://localhost:3001/` in your browser, which should return a success message if the API is running.

## Project Structure

-   `docker-compose.yml`: Defines the multi-service Docker environment, including build arguments for Next.js and no volume mount for the API.
-   `Dockerfile.api`: Dockerfile for the Node.js/Express.js API, now correctly copying `api/server.js`.
-   `Dockerfile.nextjs`: Dockerfile for the Next.js frontend application, now correctly handling `NEXT_PUBLIC_API_URL` as a build argument.
-   `schema.sql`: PostgreSQL database schema definition (simplified, no `companies` or `invitations` tables).
-   `api/`: Contains the Node.js/Express.js API source code.
    -   `server.js`: API entry point with simplified user management (no company-specific logic, no registration/invitation routes).
-   `app/`: Contains the Next.js application source code (App Router).
    -   `layout.tsx`, `page.tsx`, `globals.css`: Core Next.js files.
    -   `src/app/api/`: API routes for Next.js (e.g., `/api/login`, `/api/verify-token`).
    -   `src/components/`: React components (auth, ui, etc.).
        -   `layout/Navbar.tsx`: Updated to conditionally display login/logout and remove registration/invitation links.
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