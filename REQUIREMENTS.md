# Project Requirements

This file consolidates the setup requirements for the frontend and backend. The ecosystem manifests remain the source of truth for dependency installation: `frontend/package.json` and `frontend/package-lock.json` for npm, and `backend/pom.xml` for Maven.

## Shared tools

- Git
- Node.js `^20.19.0` or `>=22.12.0` and npm for the frontend (required by Vite 8)
- Java Development Kit (JDK) 21 for the backend
- MySQL server accessible to the backend
- Maven Wrapper 3.9.16 is included under `backend/`; a global Maven installation is not required

## Frontend

Install from `frontend/` with `npm ci`. Direct runtime dependencies:

- `clsx` `^2.1.1`
- `lucide-react` `^1.31.0`
- `react` and `react-dom` `^19.2.8`
- `react-router-dom` `^7.18.2`
- `recharts` `^3.10.1`
- `tailwind-merge` `^3.6.0`

Frontend development dependencies from `frontend/package.json`:

- `@tailwindcss/vite` `^4.3.3`
- `@types/node` `^24.13.3`
- `@types/react` `^19.2.17`
- `@types/react-dom` `^19.2.3`
- `@vitejs/plugin-react` `^6.0.4`
- `autoprefixer` `^10.5.4`
- `oxlint` `^1.75.0`
- `postcss` `^8.5.26`
- `tailwindcss` `^4.3.3`
- `typescript` `~6.0.2`
- `vite` `^8.2.0`

`frontend/package-lock.json` pins the resolved dependency tree.

Useful commands from `frontend/`:

```sh
npm ci
npm run dev
npm run build
npm run lint
```

## Backend

- Java 21
- Spring Boot 4.1.0, managed by the parent in `backend/pom.xml`
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-security`
- `spring-boot-starter-validation`
- `spring-boot-starter-webmvc`
- `mysql-connector-j` (runtime)
- `lombok` (optional)
- `spring-boot-devtools` (optional runtime)
- Test dependencies: `spring-boot-starter-data-jpa-test`, `spring-boot-starter-security-test`, `spring-boot-starter-validation-test`, and `spring-boot-starter-webmvc-test`
- Spring Boot manages the versions of the above dependencies through the parent version listed above
- Configure a MySQL database named `smart_grading_db` by default
- Backend HTTP port: `8080`
- The database URL defaults to `jdbc:mysql://localhost:3306/smart_grading_db`; `DB_URL` can override it

Configure database credentials locally for the environment. Do not commit production credentials.

Run the backend from `backend/`:

```sh
./mvnw spring-boot:run
```

On Windows, use `mvnw.cmd spring-boot:run`.