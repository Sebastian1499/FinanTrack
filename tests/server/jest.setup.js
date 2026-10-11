// Se ejecuta una vez por archivo de test, antes de que Jest instale el framework.
// Carga las variables de entorno de prueba (.env.test) para que toda la app
// (Prisma, JWT, rate limiting, etc.) use la base de datos y secretos de pruebas.
// Parser manual (en vez de la librería "dotenv") para no depender del node_modules de server/.
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '..', 'server', '.env.test');
for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  const value = trimmed.slice(eq + 1).trim().replace(/^"|"$/g, '');
  process.env[key] = value;
}

