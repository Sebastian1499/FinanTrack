// Se ejecuta una vez por archivo de test, después de instalar el framework (describe/it/etc).
// Limpia la base de datos entre pruebas para que no se contaminen entre sí.
const prisma = require('../../server/src/lib/prisma');

afterEach(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
