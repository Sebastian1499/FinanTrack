const { Router } = require('express');
const multer = require('multer');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { transactionSchema } = require('../lib/schemas');
const { categorize } = require('../lib/categorize');
const { recognizeReceipt, parseReceipt } = require('../lib/ocr');

const router = Router();
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      return cb(new Error('Formato de imagen no soportado'));
    }
    cb(null, true);
  },
});

// Envuelve multer para devolver 400 (no 500) ante archivos inválidos o demasiado grandes.
function uploadReceipt(req, res, next) {
  upload.single('receipt')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'Error al subir el archivo' });
    next();
  });
}

router.use(auth);

router.get('/', async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId: req.userId },
    orderBy: { date: 'desc' },
  });
  res.json({ transactions });
});

router.post('/', validateBody(transactionSchema), async (req, res) => {
  const { amount, description, category, date } = req.body;

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      description,
      category: category || categorize(description),
      date,
      userId: req.userId,
    },
  });
  res.status(201).json({ transaction });
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Id inválido' });
  }

  const transaction = await prisma.transaction.findUnique({ where: { id } });
  if (!transaction || transaction.userId !== req.userId) {
    return res.status(404).json({ error: 'Transacción no encontrada' });
  }
  await prisma.transaction.delete({ where: { id } });
  res.status(204).end();
});

// Sube la foto de un recibo, extrae texto con OCR y propone monto/categoría.
router.post('/scan', uploadReceipt, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Debes adjuntar una imagen del recibo (jpg, png o webp)' });
  }

  try {
    const text = await recognizeReceipt(req.file.buffer);
    const { amount, description, rawText } = parseReceipt(text);
    res.json({
      amount,
      description,
      category: categorize(rawText),
      rawText,
    });
  } catch {
    res.status(500).json({ error: 'No se pudo procesar la imagen del recibo' });
  }
});

module.exports = router;
