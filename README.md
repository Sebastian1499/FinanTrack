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
- Contador de visitas (demo, basado en `localStorage`)

## Antes de publicar: pendientes por configurar

1. **Imágenes reales**: reemplaza los SVG de ejemplo en `public/images/` (`hero-mockup.svg`, `screen-home.svg`, `screen-scan.svg`, `screen-reports.svg`, `screen-chatbot.svg`) por capturas reales del prototipo.
2. **Formulario de contacto**: en `src/components/ContactForm.jsx`, reemplaza `FORM_ENDPOINT` con tu endpoint real de [Formspree](https://formspree.io) (gratis) o tu propio backend. Mientras no lo configures, el formulario funciona en "modo demo" (guarda los datos en el navegador y no falla).
3. **Redes sociales**: en `src/components/SocialLinks.jsx`, reemplaza los enlaces de ejemplo por los reales del proyecto (GitHub, Instagram, LinkedIn, noticias).
4. **Contador de visitantes real**: el contador incluido solo cuenta visitas locales del navegador. Para estadísticas reales de todos los visitantes, integra [Google Analytics](https://analytics.google.com/) o [Plausible](https://plausible.io/) añadiendo su script en `index.html`.
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

