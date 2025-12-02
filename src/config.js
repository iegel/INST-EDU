import 'dotenv/config';

// Clave usada para firmar los JWT. Si no está en .env, usa un valor por defecto.
export const TOKEN_SECRET = process.env.TOKEN_SECRET || 'dev-secret';

// URI de conexión a MongoDB. Puede venir del .env o usar la base local por defecto.
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1/institutoeducativo';

// Puerto donde corre el servidor backend.
export const PORT = process.env.PORT || 4000;