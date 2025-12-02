// Uso bcrypt para hashear las contraseñas de admin y preceptores
const bcrypt = require("bcryptjs");

module.exports = {
  // Función que corre cuando hago `migrate-mongo up`
  async up(db, client) {
    // Referencias a las colecciones que voy a usar
    const usersCol = db.collection("users");
    const comisionesCol = db.collection("comisions");
    const alumnosCol = db.collection("alumnos");
    const materiasCol = db.collection("materias");
    const calificacionesCol = db.collection("calificacions");

    console.log("Iniciando seed_inicial_instituto (UP)");

    // 1) Limpio todos los datos anteriores generados por este seed
    //    Así me aseguro de que cada vez que corro la migración, parto de cero
    await calificacionesCol.deleteMany({});
    await materiasCol.deleteMany({ seed: true });
    await alumnosCol.deleteMany({ seed: true });
    await comisionesCol.deleteMany({ seed: true });
    await usersCol.deleteMany({ seed: true, role: { $in: ["Admin", "Preceptor"] } });

    console.log("Colecciones limpiadas");

    // 2) Creo el usuario admin con un nombre real (yo 😎)
    const adminPassword = await bcrypt.hash("123456", 10);
    await usersCol.insertOne({
      username: "ignacio.egel",
      email: "admin@instedu.com.ar",
      password: adminPassword,
      role: "Admin",
      isActive: true,
      seed: true, // flag para saber que este registro lo generó el seed
    });
    console.log("Admin creado (Ignacio Egel)");

    // 3) Defino los preceptores, uno por cada año, con nombres argentinos
    const preceptoresData = [
      { anio: 1, username: "carlos.gomez", email: "carlos.gomez@instedu.com.ar" },
      { anio: 2, username: "mariana.lopez", email: "mariana.lopez@instedu.com.ar" },
      { anio: 3, username: "diego.perez", email: "diego.perez@instedu.com.ar" },
      { anio: 4, username: "laura.fernandez", email: "laura.fernandez@instedu.com.ar" },
      { anio: 5, username: "juan.rodriguez", email: "juan.rodriguez@instedu.com.ar" },
    ];

    const preceptores = [];

    // Recorro el array y creo un usuario preceptor por cada año
    for (const p of preceptoresData) {
      const hashed = await bcrypt.hash("123456", 10);
      const doc = {
        username: p.username,
        email: p.email,
        password: hashed,
        role: "Preceptor",
        isActive: true,
        seed: true,
      };
      const res = await usersCol.insertOne(doc);
      // Guardo el _id junto con el año para vincularlo después a las comisiones
      preceptores.push({ ...doc, _id: res.insertedId, anio: p.anio });
      console.log(`Preceptor ${p.anio}º año creado: ${p.username}`);
    }

    // 4) Genero las comisiones/cursos: 1A, 1B, 2A, 2B, ..., 5A, 5B
    const divisiones = ["A", "B"];
    const cursosDocs = [];

    for (let anio = 1; anio <= 5; anio++) {
      // Busco el preceptor correspondiente a ese año
      const preceptor = preceptores.find((p) => p.anio === anio);
      for (const div of divisiones) {
        const numero = `${anio}${div}`; // Ej: "1A", "3B", etc.
        const cursoDoc = {
          numeroComision: numero,
          anio,
          curso: div,
          preceptor: preceptor._id, // guardo la referencia al preceptor
          seed: true,
        };
        const res = await comisionesCol.insertOne(cursoDoc);
        cursosDocs.push({ ...cursoDoc, _id: res.insertedId });
        console.log(`Comisión creada: ${numero}`);
      }
    }

    // 5) Creo 4 alumnos por cada curso, con nombres y apellidos “normales” de acá
    const nombres = [
      "Lucas", "Camila", "Santiago", "Agustina",
      "Matías", "Valentina", "Julián", "Martina",
      "Nicolás", "Florencia", "Franco", "Lucía",
    ];

    const apellidos = [
      "González", "Pérez", "Rodríguez", "López",
      "Fernández", "Martínez", "Sánchez", "Romero",
      "Díaz", "Herrera", "Álvarez", "Torres",
    ];

    // Uso un dniBase para generar DNIs diferentes pero claramente de prueba
    let dniBase = 45000000;

    const alumnosToInsert = [];
    let idxNombre = 0;
    let idxApellido = 0;

    for (const curso of cursosDocs) {
      for (let i = 1; i <= 4; i++) {
        const nombre = nombres[idxNombre % nombres.length];
        const apellido = apellidos[idxApellido % apellidos.length];

        alumnosToInsert.push({
          nombre,
          apellido,
          dni: String(dniBase),
          comision: curso.numeroComision, // en mi modelo la comision es un string como "1A"
          seed: true,
        });

        dniBase++;
        idxNombre++;
        idxApellido++;
      }
    }

    await alumnosCol.insertMany(alumnosToInsert);
    console.log(`${alumnosToInsert.length} alumnos creados (4 por curso, nombres reales)`);

    // 6) Materias por curso: base + variaciones según comisión
    const materiasBase = [
      "Matemática",
      "Lengua",
      "Historia",
      "Geografía",
      "Inglés",
      "Educación Física",
    ];

    const materiasExtrasPorCurso = {
      "1A": ["Plástica", "Música", "Construcción de la Ciudadanía", "Tecnología"],
      "1B": ["Música", "Computación", "Formación Ética", "Taller de Lectura"],
      "2A": ["Biología", "Tecnología", "Ciudadanía y Participación", "Taller de Escritura"],
      "2B": ["Biología", "Música", "Computación", "Proyecto Institucional"],
      "3A": ["Física", "Química", "Formación Ética", "Economía"],
      "3B": ["Física", "Química", "Tecnología", "Educación Artística"],
      "4A": ["Literatura", "Filosofía", "Sociología", "Economía"],
      "4B": ["Literatura", "Psicología", "Ciudadanía", "Arte"],
      "5A": ["Filosofía", "Política y Ciudadanía", "Proyecto Integrador", "Ética"],
      "5B": ["Psicología", "Arte Contemporáneo", "Comunicación", "Proyecto Integrador"],
    };

    // Lista de docentes con nombre y apellido típicos de Argentina
    const docentes = [
      "Andrea Castro",
      "Pablo Medina",
      "Verónica Almirón",
      "Gustavo Rivas",
      "Carolina Suárez",
      "Hernán López",
      "María Eugenia García",
      "Rodrigo Herrera",
      "Fernanda Díaz",
      "Sergio Álvarez",
      "Paula Torres",
      "Claudio Romero",
      "Jimena Figueroa",
      "Marcelo Domínguez",
      "Silvana Ortiz",
      "Diego Cabrera",
      "Natalia Benítez",
      "Javier Castillo",
      "Lorena Ponce",
      "Martín Lima",
    ];

    const materiasToInsert = [];
    let idxDocente = 0;

    for (const curso of cursosDocs) {
      const codigo = curso.numeroComision;
      const extras = materiasExtrasPorCurso[codigo] || [];
      const materiasCurso = [...materiasBase, ...extras]; // 10 materias por comisión

      for (const nombreMateria of materiasCurso) {
        const docenteNombre = docentes[idxDocente % docentes.length];
        idxDocente++;

        materiasToInsert.push({
          nombreMateria,
          docente: docenteNombre, // 👈 ahora es nombre y apellido real
          comision: codigo,
          seed: true,
        });
      }
    }

    await materiasCol.insertMany(materiasToInsert);
    console.log(
      `${materiasToInsert.length} materias creadas (10 por curso aprox., con variaciones por comisión y docentes reales)`
    );

    console.log("Migración de datos iniciales completada con éxito");
  },

  // Función que corre cuando hago `migrate-mongo down`
  // Acá deshago todo lo que creó este seed
  async down(db, client) {
    const usersCol = db.collection("users");
    const comisionesCol = db.collection("comisions");
    const alumnosCol = db.collection("alumnos");
    const materiasCol = db.collection("materias");
    const calificacionesCol = db.collection("calificacions");

    console.log("Revirtiendo seed_inicial_instituto (DOWN)");

    // Borro solo los usuarios de este seed (admin + preceptores)
    await usersCol.deleteMany({ seed: true, role: { $in: ["Admin", "Preceptor"] } });
    // Borro comisiones, alumnos y materias marcados con seed: true
    await comisionesCol.deleteMany({ seed: true });
    await alumnosCol.deleteMany({ seed: true });
    await materiasCol.deleteMany({ seed: true });

    // Dejo la colección de calificaciones vacía también
    await calificacionesCol.deleteMany({});

    console.log("Datos iniciales del seed eliminados");
  },
};
