# FinanTrack — Landing Page

Landing page de lanzamiento del prototipo **FinanTrack**, una app que usa IA (OCR + Machine Learning + ChatBot) para automatizar el control de gastos personales.

## Contenido incluido

- Nombre del prototipo y propuesta de valor (Hero)
- Descripción de la problemática
- Propuesta general del proyecto (features)
- Galería de imágenes del prototipo (placeholders en `public/images`)
- Sección "¿Quiénes somos?" con los autores
- Formulario de contacto y registro
- Enlaces a redes sociales / noticias (placeholders)
- Contador de visitas en pantalla (demo, basado en `localStorage`)
- Analítica real de visitantes con [GoatCounter](https://www.goatcounter.com/) (gratis, sin cookies de rastreo)

## Antes de publicar: pendientes por configurar

1. **Imágenes reales**: reemplaza los SVG de ejemplo en `public/images/` (`hero-mockup.svg`, `screen-home.svg`, `screen-scan.svg`, `screen-reports.svg`, `screen-chatbot.svg`) por capturas reales del prototipo.
2. **Formulario de contacto**: en `src/components/ContactForm.jsx`, reemplaza `FORM_ENDPOINT` con tu endpoint real de [Formspree](https://formspree.io) (gratis) o tu propio backend. Mientras no lo configures, el formulario funciona en "modo demo" (guarda los datos en el navegador y no falla).
3. **Redes sociales**: en `src/components/SocialLinks.jsx`, reemplaza los enlaces de ejemplo por los reales del proyecto (GitHub, Instagram, LinkedIn, noticias).
4. **Contador de visitantes real**: el contador que se ve en la página solo cuenta visitas locales del navegador (demo). Para datos reales de **todos** los visitantes (útil para justificar el proyecto ante el profesor: número de visitas, países, navegadores, referidos):
   1. Crea una cuenta gratis en [goatcounter.com/signup](https://www.goatcounter.com/signup) (no requiere tarjeta ni recopila datos personales de tus visitantes).
   2. Te darán un código de sitio, por ejemplo `finantrack.goatcounter.com`.
   3. En `index.html`, reemplaza `TU-CODIGO` por ese código en la línea `data-goatcounter="https://TU-CODIGO.goatcounter.com/count"`.
   4. Después de publicar, entra a `https://TU-CODIGO.goatcounter.com` para ver el dashboard con las estadísticas reales.
5. **Nombre del repositorio**: la landing ya está configurada para `https://github.com/Sebastian1499/FinanTrack`. Si cambias de repositorio, actualiza el `base` en `vite.config.js` y el campo `homepage` en `package.json`.

## Desarrollo local

```bash
npm install
npm run dev
```

## Publicar en GitHub Pages

1. Conecta el repositorio remoto y sube el código:
   ```bash
   git init
   git add .
   git commit -m "Landing page FinanTrack"
   git branch -M main
   git remote add origin https://github.com/Sebastian1499/FinanTrack.git
   git push -u origin main
   ```
2. Publica:
   ```bash
   npm run deploy
   ```
3. En GitHub: **Settings → Pages → Source: rama `gh-pages`**. El sitio quedará disponible en `https://Sebastian1499.github.io/FinanTrack/`.


## Equipo

- Javier Montero
- Estefania Malagon
- Sebastian Buitrago

