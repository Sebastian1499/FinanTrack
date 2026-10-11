const { Router } = require('express');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { chatSchema } = require('../lib/schemas');
const { askChatbot } = require('../lib/chatbot');

const router = Router();
router.use(auth);

router.post('/', validateBody(chatSchema), async (req, res) => {
  const { message, history } = req.body;

  const goals = await prisma.goal.findMany({ where: { userId: req.userId } });
  // Limita el historial enviado a la IA para no disparar el costo/latencia del contexto.
  const trimmedHistory = (history || []).slice(-10);
  const reply = await askChatbot(message, { goals, history: trimmedHistory });
  res.json({ reply });
});

module.exports = router;
