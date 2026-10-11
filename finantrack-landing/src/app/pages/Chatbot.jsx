import { useRef, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { api } from '../../api/client';

const WELCOME = {
  role: 'bot',
  text: 'Hola, soy tu asistente financiero. Pregúntame cosas como "cuánto debo ahorrar para 3000000 en 6 meses".',
};

export default function Chatbot() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setSending(true);
    try {
      const data = await api.sendChatMessage(token, text, messages.filter((m) => m !== WELCOME));
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: 'No pude responder en este momento, intenta de nuevo.' }]);
    } finally {
      setSending(false);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
      });
    }
  }

  return (
    <div className="chat-page">
      <h1>Asistente financiero</h1>
      <div className="chat-window" ref={listRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble chat-bubble--${m.role}`}>
            {m.text}
          </div>
        ))}
        {sending && <div className="chat-bubble chat-bubble--bot">Escribiendo…</div>}
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta financiera…"
        />
        <button type="submit" className="btn btn--primary" disabled={sending}>
          Enviar
        </button>
      </form>
    </div>
  );
}
