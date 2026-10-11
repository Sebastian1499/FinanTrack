# Pruebas de FinanTrack

Esta carpeta concentra **toda la suite de pruebas** del proyecto (backend, frontend y end-to-end),
separada del código fuente de cada app. Cada subcarpeta usa las herramientas de testing instaladas
en el `package.json` del proyecto al que pertenece (no instala nada por su cuenta, salvo `e2e/`).

```
tests/
  server/     Jest + Supertest -> pruebas de la API (server/)
  frontend/   Vitest + React Testing Library -> pruebas de componentes (finantrack-landing/)
  e2e/        Playwright -> flujo completo en navegador real, contra los dos servidores corriendo
```

## Correr todo

```bash
# Backend: 56 pruebas (auth, transacciones, metas, chat, seguridad, utilidades)
npm --prefix server test

# Frontend: 16 pruebas (AuthContext, api client, Login, Dashboard, ProtectedRoute)
npm --prefix finantrack-landing test

# E2E: 3 escenarios completos en Chromium real (primera vez: instala el navegador)
npm --prefix tests/e2e install
npx --prefix tests/e2e playwright install chromium
npm --prefix tests/e2e test
```

El E2E levanta automáticamente la API (`:4000`) y el frontend (`:5173`) si no están corriendo
(`webServer` en `playwright.config.js`, con `reuseExistingServer: true`).

## Qué cubre cada suite

**server/** (56 tests)
- Registro/login: validaciones, contraseñas hasheadas, duplicados, credenciales inválidas
- Transacciones: CRUD, autocategorización, **aislamiento entre usuarios (anti-IDOR)**, validación de archivos subidos
- Metas: CRUD, cálculo de ahorro mensual, aislamiento entre usuarios
- Chat: cálculo de metas en lenguaje natural (motor de reglas, determinista en tests)
- Seguridad: cabeceras de helmet, bloqueo de CORS, **rate limiting anti fuerza bruta**, protección contra mass-assignment
- Unitarias: `categorize()`, `parseAmountToken()`/`extractAmounts()` (incluye test de regresión del bug de parseo de montos), motor de reglas del chatbot

**frontend/** (16 tests)
- Cliente API: headers, manejo de errores, FormData
- `AuthContext`/`useAuth`: login, logout, sesión persistida, limpieza automática si el token expiró
- `Login`: navegación tras éxito, mensaje de error del servidor
- `Dashboard`: cálculo y render del total y desglose por categoría
- `ProtectedRoute`: loader, redirección sin sesión, acceso con sesión

**e2e/** (3 tests)
- Landing carga con la marca y el CTA
- Flujo real completo: registro → transacción (autocategorizada) → meta (con cálculo de ahorro) → chatbot → logout
- Una ruta protegida (`/app`) no es accesible sin sesión

## Notas

- `server/.env.test` fija `AI_API_KEY` vacío a propósito: los tests del chatbot deben ser deterministas,
  no dependen de llamadas reales a Gemini/OpenAI.
- La base de datos de pruebas es un SQLite separado (`server/prisma/test.db`), se recrea en cada
  corrida (`pretest` corre `prisma migrate deploy`) y se limpia entre tests (`afterEach` borra usuarios,
  lo cual cascada a sus transacciones/metas).
