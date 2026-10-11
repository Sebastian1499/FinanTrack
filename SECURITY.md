# Seguridad de FinanTrack

Resumen de las medidas de seguridad implementadas en el backend (`server/`) y su justificación,
mapeadas a las categorías relevantes del [OWASP Top 10](https://owasp.org/Top10/).

## Autenticación y control de acceso

- **Contraseñas**: hasheadas con `bcrypt` (12 rounds), nunca se devuelven ni se guardan en texto plano.
- **JWT**: firmado con `JWT_SECRET` (obligatorio al arrancar — el servidor falla rápido si falta),
  expira a los 7 días.
- **Autorización por recurso**: toda ruta de transacciones/metas valida que el recurso pertenezca al
  usuario autenticado (`WHERE userId = req.userId`) antes de leer/editar/borrar. Cubierto por tests
  explícitos anti-[IDOR](https://owasp.org/www-community/Insecure_Direct_Object_Reference) (ver `tests/server/transactions.test.js` y `goals.test.js`).
- **Rate limiting**: `/api/auth/*` limitado a 20 intentos / 15 min por IP (anti fuerza bruta en
  login/registro); el resto de `/api/*` a 300 / 15 min.

## Validación y manejo de datos

- **Validación de entrada con `zod`** en todas las rutas (`server/src/lib/schemas.js`): tipos, rangos,
  longitudes máximas y formato de email. Los esquemas usan `strip` por defecto, así que campos extra
  no declarados (ej. intentar forzar `userId` propio) se descartan automáticamente (anti *mass assignment*).
- **IDs de ruta**: se valida que sean enteros antes de consultarlos (evita errores 500 y previene
  comportamientos inesperados en la capa de datos).
- **Prisma ORM** con queries parametrizadas: no hay SQL concatenado a mano, por lo que no hay
  superficie de inyección SQL en las consultas de la app.
- **Subida de archivos** (`/api/transactions/scan`): `multer` con límite de tamaño (8 MB) y
  `fileFilter` que solo acepta tipos MIME de imagen (`jpeg`, `png`, `webp`, `heic`, `heif`); errores de
  archivo devuelven 400, no 500.

## Cabeceras y transporte

- **Helmet**: cabeceras de seguridad estándar (`X-Content-Type-Options`, `X-Frame-Options`,
  `Strict-Transport-Security`, CSP por defecto, etc.) y oculta `X-Powered-By`.
- **CORS con allowlist**: solo orígenes listados en `CORS_ORIGIN` (coma-separado) pueden llamar a la
  API; cualquier otro origen es rechazado explícitamente (no `cors()` abierto a `*`).
- **Límite de tamaño de body JSON**: 1 MB, para mitigar payloads de denegación de servicio.

## Manejo de errores

- El error handler global nunca expone stack traces ni detalles internos al cliente (mensaje genérico),
  pero sí registra el error completo en el log del servidor para diagnóstico.

## Variables de entorno y secretos

- `.env` (con secretos reales) está excluido de git; `.env.example` documenta las variables sin
  valores sensibles.
- El servidor **rehúsa arrancar** si `JWT_SECRET` no está definido, en vez de usar un valor por defecto
  inseguro.
- La API key de IA (`AI_API_KEY`) es opcional y nunca se expone al frontend (solo vive en el backend).

## Pendientes conocidos / fuera de alcance de este prototipo académico

- HTTPS/TLS se asume manejado por la plataforma de despliegue (ej. reverse proxy), no por Express directamente.
- No hay rotación de JWT ni lista de revocación (logout es solo del lado del cliente); aceptable para
  un prototipo, pero a mejorar antes de producción real (refresh tokens + blacklist).
- `npm audit` reporta vulnerabilidades en dependencias de desarrollo (`nodemon`/`jest`, vía `braces`/`chokidar`
  desactualizados) que no se ejecutan en producción; no se fuerza el upgrade porque implica downgrades
  breaking de `nodemon`.

Ver también [tests/README.md](tests/README.md) para los tests que verifican estas medidas
(rate limiting, CORS, validación, aislamiento entre usuarios, cabeceras).
