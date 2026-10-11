const { Router } = require('express');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { goalSchema, goalUpdateSchema } = require('../lib/schemas');

const router = Router();
router.use(auth);

function withPlan(goal) {
  const now = new Date();
  const monthsLeft = Math.max(
    1,
    Math.ceil((new Date(goal.targetDate) - now) / (1000 * 60 * 60 * 24 * 30)),
  );
  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
  return { ...goal, monthsLeft, monthlySavingNeeded: remaining / monthsLeft };
}

router.get('/', async (req, res) => {
  const goals = await prisma.goal.findMany({
    where: { userId: req.userId },
    orderBy: { targetDate: 'asc' },
  });
  res.json({ goals: goals.map(withPlan) });
});

router.post('/', validateBody(goalSchema), async (req, res) => {
  const { name, targetAmount, targetDate, savedAmount } = req.body;

  const goal = await prisma.goal.create({
    data: {
      name,
      targetAmount,
      targetDate,
      savedAmount: savedAmount || 0,
      userId: req.userId,
    },
  });
  res.status(201).json({ goal: withPlan(goal) });
});

router.patch('/:id', validateBody(goalUpdateSchema), async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Id inválido' });
  }

  const goal = await prisma.goal.findUnique({ where: { id } });
  if (!goal || goal.userId !== req.userId) {
    return res.status(404).json({ error: 'Meta no encontrada' });
  }

  const updated = await prisma.goal.update({
    where: { id },
    data: { savedAmount: req.body.savedAmount },
  });
  res.json({ goal: withPlan(updated) });
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Id inválido' });
  }

  const goal = await prisma.goal.findUnique({ where: { id } });
  if (!goal || goal.userId !== req.userId) {
    return res.status(404).json({ error: 'Meta no encontrada' });
  }
  await prisma.goal.delete({ where: { id } });
  res.status(204).end();
});

module.exports = router;
