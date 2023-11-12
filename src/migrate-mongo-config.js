const config = {
    mongodb: {
      url: 'http://localhost:27017/', // URL de tu base de datos MongoDB
      databaseName: 'institutoeducativo',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
    migrationsDir: 'migrations', // Directorio donde se almacenarán las migraciones
    changelogCollectionName: 'changelog',
  };
  
  module.exports = config;
  