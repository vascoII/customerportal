# Project Setup Guide Portal Backend

This guide explains how to setup and run the project localy

## 1. Clone the repository
```bash
git clone <this-repo-url>
cd project_name
```
---

## 2. Check Symfony requirements
If you have Symfony CLI installed:
```bash
symfony check:requirements
```
---

## 3. Envireoment configuration
Copy the environment example file and adjust the values as needed:
```bash
copy .env.exemple .env
```
Fill in the required variables inside .env
---

## 4. Install dependencies
Install PHP depedencies:
```bash
composer install
```
Install JavaScript depedencies
```bash
npm install
```
Build the assets (for developments)
```bash
npm run dev
```
---

## 5. Security check
(Optional, but recommended):
```bash
symfony check:security
```
---

## 6. Start the server
Run the Symfony local web server
```bash
symfony server:start
```
The application will be available at https://127.0.0.1:8000
---

## 7. Docker environments

Four helper scripts are available to run the stack with Docker:

| Environment | Script | Env file | Backend/Frontend ports |
|-------------|--------|----------|-------------------------|
| Local       | `./docker-dev.sh` | `.env.local` | 8000 / 3000 |
| Preview     | `./docker-preview.sh` | `.env.preview` | 8000 / 3000 |
| Demo        | `./docker-demo.sh` | `.env.demo` | 8080 / 3030 |
| Production  | `./docker-production.sh` | `.env.production` | 8090 / 3040 |

Steps:
1. Copy the matching `.env.<env>.example` file to `.env.<env>` and adjust the variables if needed.
2. Run the corresponding script (e.g. `./docker-dev.sh up --build` for the first run).
3. Pass any `docker compose` subcommand/flags after the script name (`./docker-dev.sh down`, `./docker-demo.sh up -d`, etc.).

The scripts automatically pick the right Compose files and expose the backend and frontend using the ports defined in the env file.