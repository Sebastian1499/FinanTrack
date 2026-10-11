import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { api } from '../../api/client';

export default function ScanReceipt() {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    setFile(selected || null);
    setResult(null);
    setSaved(false);
    setError('');
    setPreview(selected ? URL.createObjectURL(selected) : null);
  }

  async function handleScan() {
    if (!file) return;
    setScanning(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('receipt', file);
      const data = await api.scanReceipt(token, formData);
      setResult({ amount: data.amount ?? '', description: data.description, category: data.category });
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  }

  function handleResultChange(e) {
    setResult((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleConfirm() {
    await api.createTransaction(token, {
      amount: Number(result.amount),
      description: result.description,
      category: result.category,
    });
    setSaved(true);
  }

  return (
    <div className="scan-page">
      <h1>Escanear recibo</h1>
      <p className="section__intro">
        Sube la foto de un recibo o factura. FinanTrack extrae el texto con OCR y te propone el monto
        y la categoría para que los confirmes antes de guardarlos.
      </p>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Vista previa del recibo" className="scan-page__preview" />}

      <button type="button" className="btn btn--primary" onClick={handleScan} disabled={!file || scanning}>
        {scanning ? 'Analizando imagen…' : 'Escanear recibo'}
      </button>

      {error && <p className="auth-card__error">{error}</p>}

      {result && (
        <div className="scan-page__result">
          <h2>Revisa los datos detectados</h2>
          <label>
            Monto
            <input type="number" name="amount" value={result.amount} onChange={handleResultChange} />
          </label>
          <label>
            Descripción
            <input type="text" name="description" value={result.description} onChange={handleResultChange} />
          </label>
          <label>
            Categoría
            <input type="text" name="category" value={result.category} onChange={handleResultChange} />
          </label>
          <button type="button" className="btn btn--primary" onClick={handleConfirm} disabled={saved}>
            {saved ? 'Guardado ✓' : 'Guardar como transacción'}
          </button>
        </div>
      )}
    </div>
  );
}
