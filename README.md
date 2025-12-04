# INST-EDU

## Configurar backend

### 0) Instalar MongoDB

### 1) Instalar Node

### 2) Instalar paquetes:

1. `npm i`
2. `npm i nodemon`

### 3) Generar nuevo archivo .env con las siguientes variables:

    PORT=4000
    MONGO_URI=mongodb://127.0.0.1/institutoeducativo
    TOKEN_SECRET=super-secret-key

### 4) Correr migraciones

`db-migrations\npx migrate-mongo up`

### 4) Ejecutar backend

`npm run dev`

## Configurar frontend

### 1) Generar nuevo archivo .env con las siguientes variable:

    VITE_API_URL=http://localhost:4000/api

### 2) Ejecutar frontend

`npm run dev`

## **Perfiles para sign in**

### Usuario admin:
    Mail: admin@instedu.com.ar
    Password: 123456
