const { test, expect } = require('@playwright/test');

const uniqueEmail = `e2e_${Date.now()}@test.com`;
const password = 'password123';
const userName = 'Usuario E2E';

test.describe.configure({ mode: 'serial' });

test('landing carga con los colores y el CTA de la marca', async ({ page }) => {
  await page.goto('/FinanTrack/');
  await expect(page.getByRole('heading', { level: 1, name: 'FinanTrack' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Quiero registrarme' })).toBeVisible();
});

test('flujo completo: registro -> transacción -> meta -> chatbot -> logout', async ({ page }) => {
  // Registro
  await page.goto('/FinanTrack/#/register');
  await page.getByLabel('Nombre').fill(userName);
  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Registrarme' }).click();

  await expect(page).toHaveURL(/#\/app$/);
  await expect(page.getByText(`Hola, ${userName.split(' ')[0]}`)).toBeVisible();

  // Transacciones: crear y verificar autocategorización
  await page.getByRole('navigation').getByRole('link', { name: 'Transacciones' }).click();
  await page.getByPlaceholder('Monto').fill('45000');
  await page
    .getByPlaceholder('Descripción (ej. Almuerzo en restaurante)')
    .fill('Almuerzo en restaurante E2E');
  await page.getByRole('button', { name: 'Agregar' }).click();

  await expect(page.getByRole('cell', { name: 'Alimentación' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '$ 45.000' })).toBeVisible();

  // Metas: crear y verificar cálculo de ahorro mensual
  await page.getByRole('link', { name: 'Metas de ahorro' }).click();
  await page.getByPlaceholder('Nombre de la meta (ej. Viaje a Cartagena)').fill('Meta E2E');
  await page.getByPlaceholder('Monto objetivo').fill('1200000');

  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + 12);
  await page.locator('input[type="date"]').fill(targetDate.toISOString().slice(0, 10));
  await page.getByRole('button', { name: 'Crear meta' }).click();

  await expect(page.getByText('Meta E2E')).toBeVisible();
  await expect(page.getByText(/ahorra \$\s?[\d.]+ al mes/)).toBeVisible();

  // Chatbot: verifica que el cálculo de ahorro sea correcto (con reglas locales o IA real)
  await page.getByRole('link', { name: 'Asistente IA' }).click();
  await page
    .getByPlaceholder('Escribe tu pregunta financiera…')
    .fill('quiero ahorrar 6000000 para un viaje en 10 meses');
  await page.getByRole('button', { name: 'Enviar' }).click();

  // La IA real a veces usa "," y a veces "." como separador de miles; aceptamos ambos.
  // Timeout generoso porque la latencia de la IA externa (Gemini free tier) es variable.
  await expect(page.getByText(/600[.,]000/)).toBeVisible({ timeout: 30_000 });

  // Logout vuelve al login
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await expect(page).toHaveURL(/#\/login$/);
});

test('bloquea el acceso a /app sin sesión iniciada', async ({ page, context }) => {
  await context.clearCookies();
  await page.goto('/FinanTrack/');
  await page.evaluate(() => localStorage.clear());

  await page.goto('/FinanTrack/#/app');
  await expect(page).toHaveURL(/#\/login$/);
});
