const dotenv = require("dotenv");

// lee el .env de la raíz del proyecto
dotenv.config({ path: "../.env" });

module.exports = {
  mongodb: {
    url: process.env.MONGO_URI,
    databaseName: process.env.MONGO_DB_NAME,
    // 🔴 SAQUÉ options porque el driver nuevo no lo necesita
  },

  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  moduleSystem: "commonjs",
};
