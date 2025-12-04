const dotenv = require("dotenv");

// lee el .env de la raíz del proyecto
dotenv.config({ path: "../.env" });

module.exports = {
  mongodb: {
    url: process.env.MONGO_URI,
    databaseName: process.env.MONGO_DB_NAME,
  },

  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  moduleSystem: "commonjs",
};
