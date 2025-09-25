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