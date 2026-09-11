import { useState } from 'react';

// Reemplaza esto con tu endpoint real de Formspree (https://formspree.io) o tu propio backend.
const FORM_ENDPOINT = 'https://formspree.io/f/TU_FORM_ID';
const DEMO_MODE = FORM_ENDPOINT.includes('TU_FORM_ID');

const initialState = { name: '', email: '', message: '', subscribe: true };

export default function ContactForm() {
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('sending');

    if (DEMO_MODE) {
      // Modo demo: guarda el registro localmente mientras se configura un backend real.
      const stored = JSON.parse(localStorage.getItem('finantrack_contacts') || '[]');
      stored.push({ ...formData, date: new Date().toISOString() });
      localStorage.setItem('finantrack_contacts', JSON.stringify(stored));
      setStatus('success');
      setFormData(initialState);
      return;
    }

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(event.target),
      });
      if (response.ok) {
        setStatus('success');
        setFormData(initialState);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contacto" className="section">
      <h2>Contacto y registro</h2>
      <p className="section__intro">
        ¿Quieres estar al tanto del lanzamiento de FinanTrack? Regístrate o
        escríbenos tus dudas.
      </p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          value={formData.name}
          onChange={handleChange}
        />

        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={150}
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="message">Mensaje</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={500}
          value={formData.message}
          onChange={handleChange}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="subscribe"
            checked={formData.subscribe}
            onChange={handleChange}
          />
          Deseo registrarme para recibir novedades de FinanTrack
        </label>

        <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Enviando...' : 'Enviar'}
        </button>

        {status === 'success' && (
          <p className="form-message form-message--success">
            ¡Gracias! Hemos recibido tu registro.
            {DEMO_MODE && ' (Modo demo: configura Formspree en el README para recibir estos datos por correo.)'}
          </p>
        )}
        {status === 'error' && (
          <p className="form-message form-message--error">
            Ocurrió un error al enviar el formulario. Intenta nuevamente.
          </p>
        )}
      </form>
    </section>
  );
}
