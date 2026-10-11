const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().trim().toLowerCase().email('Email inválido').max(200),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(100),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

const transactionSchema = z.object({
  amount: z.coerce.number().positive('El monto debe ser mayor a 0').finite(),
  description: z.string().trim().min(1, 'La descripción es obligatoria').max(300),
  category: z.string().trim().max(50).optional(),
  date: z.coerce.date().optional(),
});

const goalSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio').max(150),
  targetAmount: z.coerce.number().positive('El monto objetivo debe ser mayor a 0').finite(),
  targetDate: z.coerce.date(),
  savedAmount: z.coerce.number().min(0).finite().optional(),
});

const goalUpdateSchema = z.object({
  savedAmount: z.coerce.number().min(0, 'El monto ahorrado no puede ser negativo').finite(),
});

const chatSchema = z.object({
  message: z.string().trim().min(1, 'El mensaje no puede estar vacío').max(1000),
  history: z
    .array(z.object({ role: z.enum(['user', 'bot']), text: z.string().max(1000) }))
    .max(20)
    .optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  transactionSchema,
  goalSchema,
  goalUpdateSchema,
  chatSchema,
};
