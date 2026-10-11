// Prepara la base de datos SQLite de pruebas antes de correr la suite (pretest).
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const serverDir = path.join(__dirname, '..', '..', 'server');

// Parser mínimo de .env (evita depender de node_modules de otra carpeta).
const envPath = path.join(serverDir, '.env.test');
const envVars = {};
for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  envVars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim().replace(/^"|"$/g, '');
}

execSync('npx prisma migrate deploy', {
  cwd: serverDir,
  stdio: 'inherit',
  env: { ...process.env, ...envVars },
});
