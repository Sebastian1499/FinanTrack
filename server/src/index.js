require('dotenv').config({ path: require('path').join(__dirname, '..', '.env'), quiet: true });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido. Configúralo en server/.env antes de iniciar el servidor.');
}

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const goalRoutes = require('./routes/goals');
const chatRoutes = require('./routes/chat');

const app = express();

// Detrás de un proxy/balanceador (Render, Railway, etc.) para que express-rate-limit
// identifique la IP real del cliente en vez de la del proxy.
app.set('trust proxy', 1);

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Sin "origin" = peticiones sin navegador (curl, apps móviles, health checks).
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Origen no permitido por CORS'));
    },
  }),
);
app.use(express.json({ limit: '1mb' }));

// Límite general: 300 peticiones / 15 min por IP.
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// Límite estricto en login/registro para frenar fuerza bruta: 20 intentos / 15 min por IP.
app.use(
  '/api/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiados intentos, intenta de nuevo más tarde.' },
  }),
);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/chat', chatRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`FinanTrack API escuchando en http://localhost:${PORT}`));
}

module.exports = app;
