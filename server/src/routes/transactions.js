const { Router } = require('express');
const multer = require('multer');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { transactionSchema } = require('../lib/schemas');
const { categorize } = require('../lib/categorize');
const { recognizeReceipt } = require('../lib/ocr');
const { prepareReceiptImage } = require('../lib/receiptImage');
const { parseReceipt } = require('../lib/receiptParser');

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
  const { amount, type, description, category, date } = req.body;

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      type,
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

// Sube la foto de un recibo, la prepara, extrae texto con OCR y propone comercio, monto y categoría.
// La respuesta es solo una propuesta: el cliente debe confirmarla antes de guardar.
router.post('/scan', uploadReceipt, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Debes adjuntar una imagen del recibo (jpg, png o webp)' });
  }

  let image;
  try {
    image = await prepareReceiptImage(req.file.buffer);
  } catch {
    return res.status(422).json({ error: 'No pudimos leer la imagen. Intenta con otra foto.' });
  }

  try {
    const ocr = await recognizeReceipt(image);
    res.json({ type: 'EXPENSE', ...parseReceipt(ocr) });
  } catch {
    res.status(500).json({ error: 'No se pudo procesar la imagen del recibo' });
  }
});

module.exports = router;
