import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// Los archivos de prueba viven en ../tests/frontend (fuera de esta carpeta), por lo que
// Node no encuentra node_modules al subir desde ahí. Se alían explícitamente los paquetes
// de testing a esta instalación para evitar una copia duplicada de React.
function testDep(name) {
  return path.resolve(import.meta.dirname, 'node_modules', name)
}

export default defineConfig({
  plugins: [react()],
  base: '/FinanTrack/',
  resolve: {
    alias: {
      vitest: testDep('vitest'),
      '@testing-library/jest-dom/matchers': testDep('@testing-library/jest-dom/matchers'),
      '@testing-library/jest-dom': testDep('@testing-library/jest-dom'),
      '@testing-library/react': testDep('@testing-library/react'),
      '@testing-library/user-event': testDep('@testing-library/user-event'),
      'react-router-dom': testDep('react-router-dom'),
      'react/jsx-dev-runtime': testDep('react/jsx-dev-runtime'),
      'react/jsx-runtime': testDep('react/jsx-runtime'),
      'react-dom/client': testDep('react-dom/client'),
      'react-dom': testDep('react-dom'),
      react: testDep('react'),
    },
  },
  server: {
    fs: { allow: ['..'] },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['../tests/frontend/**/*.test.{js,jsx}'],
    setupFiles: ['../tests/frontend/setup.js'],
  },
})
