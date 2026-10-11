const { extractAmounts } = require('./numbers');

// Extrae "ahorrar X en N meses/años" del mensaje del usuario.
function parseSavingsIntent(message) {
  const monthsMatch = message.match(/(\d+)\s*(meses|mes|años|año)/i);
  if (!monthsMatch) return null;

  let months = parseInt(monthsMatch[1], 10);
  if (/año/i.test(monthsMatch[2])) months *= 12;

  const withoutMonths = message.replace(monthsMatch[0], '');
  const amounts = extractAmounts(withoutMonths);
  if (!amounts.length) return null;

  return { amount: Math.max(...amounts), months };
}

function formatCOP(amount) {
  return amount.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
}

function ruleBasedReply(message, context = {}) {
  const text = message.toLowerCase();

  const savings = parseSavingsIntent(message);
  if (savings) {
    const monthly = savings.amount / savings.months;
    return `Para reunir ${formatCOP(savings.amount)} en ${savings.months} ${savings.months === 1 ? 'mes' : 'meses'}, deberías ahorrar aproximadamente ${formatCOP(monthly)} cada mes.`;
  }

  if (/mis? metas?/.test(text) && context.goals?.length) {
    const lines = context.goals.map((g) => `• ${g.name}: ${formatCOP(g.savedAmount)} de ${formatCOP(g.targetAmount)}`);
    return `Estas son tus metas actuales:\n${lines.join('\n')}`;
  }

  if (/presupuesto/.test(text)) {
    return 'Una regla simple es 50/30/20: 50% para necesidades, 30% para gustos y 20% para ahorro o deudas. ¿Quieres que calculemos cuánto sería eso con tus ingresos?';
  }

  if (/deuda/.test(text)) {
    return 'Para salir de deudas, prioriza pagar primero la que tenga la tasa de interés más alta mientras pagas el mínimo de las demás.';
  }

  if (/gast(o|ar|os)/.test(text)) {
    return 'Registra cada gasto apenas lo hagas (o escanea el recibo) para ver patrones reales en tus categorías de gasto.';
  }

  if (/hola|buenas|hey/.test(text)) {
    return 'Hola, soy el asistente financiero de FinanTrack. Puedo ayudarte a calcular cuánto ahorrar para una meta, por ejemplo: "quiero ahorrar 3000000 en 6 meses".';
  }

  return 'Puedo ayudarte a planear tus ahorros. Intenta preguntarme algo como: "cuánto debo ahorrar para 5000000 en 10 meses".';
}

async function aiReply(message, context) {
  const baseUrl = process.env.AI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai';
  const model = process.env.AI_MODEL || 'gemini-3.8-flash';
  const apiKey = process.env.AI_API_KEY;

  const systemPrompt = `Eres el asistente financiero de la app FinanTrack. Responde en español, de forma breve y práctica, ayudando al usuario a organizar sus gastos y metas de ahorro.${
    context.goals?.length ? ` Metas actuales del usuario: ${JSON.stringify(context.goals)}.` : ''
  }`;

  const history = (context.history || []).map((m) => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: m.text,
  }));

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...history, { role: 'user', content: message }],
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`La IA respondió ${response.status}: ${errorBody}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim();
}

async function askChatbot(message, context = {}) {
  if (process.env.AI_API_KEY) {
    try {
      const reply = await aiReply(message, context);
      if (reply) return reply;
    } catch (err) {
      console.error('Fallback a reglas locales, la IA externa falló:', err.message);
    }
  }
  return ruleBasedReply(message, context);
}

module.exports = { askChatbot };
