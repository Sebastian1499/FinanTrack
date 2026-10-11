// Valida req.body contra un esquema zod; responde 400 con el primer error si falla.
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return res.status(400).json({ error: firstIssue?.message || 'Datos inválidos' });
    }
    req.body = result.data;
    next();
  };
}

module.exports = { validateBody };
