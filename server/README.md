# FinanTrack — API

Backend REST de **FinanTrack**: autenticación JWT, transacciones, metas de ahorro, escaneo de recibos (OCR) y chatbot financiero.

> Seguridad implementada: ver [../SECURITY.md](../SECURITY.md). Suite de pruebas (56 tests): ver [../tests/README.md](../tests/README.md).

## Stack

- Node.js + Express
- Prisma + SQLite (archivo local `prisma/dev.db`, sin necesidad de instalar un servidor de base de datos)
- JWT + bcrypt para autenticación
- [tesseract.js](https://github.com/naptha/tesseract.js) para OCR de recibos (corre localmente, sin costo)
- Categorización de gastos por reglas de palabras clave (sin modelo entrenado)
- Chatbot: motor de reglas local (cálculo de metas de ahorro) como respaldo. Si defines `AI_API_KEY`, usa un modelo de IA real (por defecto Google Gemini, capa gratuita) a través de una API compatible con OpenAI.

## Configuración

```bash
npm install
npx prisma migrate dev   # crea la base de datos SQLite (solo la primera vez)
npm run dev              # http://localhost:4000
```

Variables de entorno (`.env`, ver `.env.example`):

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Ruta del archivo SQLite (por defecto `file:./dev.db`) |
| `JWT_SECRET` | Secreto para firmar los tokens. **Cámbialo en producción.** |
| `PORT` | Puerto del servidor (por defecto 4000) |
| `AI_API_KEY` | Opcional. Si se define, el chatbot usa un modelo de IA real en vez del motor de reglas local |
| `AI_BASE_URL` | URL base compatible con OpenAI (por defecto la de Google Gemini) |
| `AI_MODEL` | Nombre del modelo a usar (por defecto `gemini-3.8-flash`) |

### Activar el chatbot con IA real (Google Gemini, gratis)

1. Entra a [aistudio.google.com/apikey](https://aistudio.google.com/apikey) y crea una API key gratuita (requiere cuenta de Google, sin tarjeta).
2. Pega la key en `server/.env` en la variable `AI_API_KEY`. **Nunca compartas esta key en el chat ni la subas a git.**
3. Reinicia el servidor (`npm run dev`). El chatbot usará Gemini automáticamente; si la llamada falla por cualquier motivo, el backend cae de vuelta al motor de reglas local sin romper la conversación.

Para usar otro proveedor compatible con OpenAI (OpenRouter, Groq, Together, Azure OpenAI, etc.) solo cambia `AI_BASE_URL` y `AI_MODEL` según la documentación de ese proveedor.

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Crea una cuenta |
| POST | `/api/auth/login` | Inicia sesión, devuelve JWT |
| GET | `/api/auth/me` | Usuario actual (requiere token) |
| GET/POST | `/api/transactions` | Listar / crear transacciones |
| DELETE | `/api/transactions/:id` | Eliminar transacción |
| POST | `/api/transactions/scan` | Sube una foto de recibo (`multipart/form-data`, campo `receipt`), hace OCR y devuelve monto/categoría sugeridos |
| GET/POST | `/api/goals` | Listar / crear metas de ahorro |
| PATCH/DELETE | `/api/goals/:id` | Actualizar ahorro acumulado / eliminar meta |
| POST | `/api/chat` | Envía un mensaje al asistente financiero |

Todas las rutas (excepto `/auth/register` y `/auth/login`) requieren el header `Authorization: Bearer <token>`.

## Notas de producción

- Para usar PostgreSQL en vez de SQLite, cambia `provider = "sqlite"` por `"postgresql"` en `prisma/schema.prisma` y apunta `DATABASE_URL` a tu servidor Postgres, luego corre `npx prisma migrate dev`.
- Configura CORS (`src/index.js`) con el dominio real del frontend antes de desplegar.
