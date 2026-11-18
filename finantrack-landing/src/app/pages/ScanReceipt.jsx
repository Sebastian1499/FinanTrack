import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { api } from '../../api/client';

const CAMERA_ERRORS = {
  NotAllowedError: 'Permiso de cámara denegado. Actívalo en la configuración del navegador para tomar fotos.',
  NotFoundError: 'No encontramos una cámara en este dispositivo.',
  NotReadableError: 'La cámara está siendo usada por otra aplicación.',
};

const EMPTY_RESULT = { type: 'EXPENSE', amount: '', description: '', category: '' };

export default function ScanReceipt() {
  const { token } = useAuth();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const cameraSupported = typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);

  // Asigna el stream al video cuando la cámara se abre.
  useEffect(() => {
    if (cameraOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraOn]);

  // Libera la cámara al salir de la pantalla.
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
  }

  // El navegador muestra la solicitud de permiso al llamar a getUserMedia.
  async function openCamera() {
    setCameraError('');
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
    } catch (err) {
      setCameraError(CAMERA_ERRORS[err.name] || 'No se pudo abrir la cámara. Puedes subir una foto desde archivo.');
    }
  }

  function selectFile(selected) {
    setFile(selected);
    setResult(null);
    setSaved(false);
    setError('');
    setPreview(selected ? URL.createObjectURL(selected) : null);
  }

  async function processFile(target) {
    setScanning(true);
    setError('');
    setResult(null);
    setSaved(false);
    try {
      const formData = new FormData();
      formData.append('receipt', target);
      const data = await api.scanReceipt(token, formData);
      setResult({
        type: data.type || 'EXPENSE',
        amount: data.amount ?? '',
        description: data.description ?? '',
        category: data.category ?? '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError('No se pudo capturar la imagen. Inténtalo de nuevo.');
          return;
        }
        const captured = new File([blob], `recibo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        stopCamera();
        selectFile(captured);
        processFile(captured);
      },
      'image/jpeg',
      0.92,
    );
  }

  function handleFileChange(e) {
    selectFile(e.target.files?.[0] || null);
  }

  function handleResultChange(e) {
    setResult((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleConfirm(e) {
    e.preventDefault();
    setError('');
    try {
      await api.createTransaction(token, {
        amount: Number(result.amount),
        type: result.type,
        description: result.description,
        category: result.category || undefined,
      });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    }
  }

  function resetScan() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setSaved(false);
    setError('');
  }

  return (
    <div className="scan-page">
      <header className="page-header">
        <h1>Escanear recibo</h1>
        <p className="page-header__subtitle">
          Toma una foto del recibo o sube una imagen. FinanTrack extrae el monto y la descripción para que los
          confirmes antes de guardar.
        </p>
      </header>

      <section className="panel scan-panel">
        {!cameraOn && (
          <div className="scan-actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={openCamera}
              disabled={!cameraSupported || scanning}
            >
              Tomar foto con cámara
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={scanning}
            >
              Subir desde archivo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="visually-hidden"
              tabIndex={-1}
            />
          </div>
        )}

        {!cameraSupported && (
          <p className="panel__empty">
            Este navegador no permite usar la cámara (requiere HTTPS). Puedes subir una imagen desde archivo.
          </p>
        )}
        {cameraError && <p className="auth-card__error">{cameraError}</p>}

        {cameraOn && (
          <div className="camera">
            <video ref={videoRef} className="camera__video" autoPlay playsInline muted />
            <div className="camera__actions">
              <button type="button" className="btn btn--primary" onClick={capturePhoto}>
                Capturar y analizar
              </button>
              <button type="button" className="btn btn--ghost" onClick={stopCamera}>
                Cancelar
              </button>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="visually-hidden" />

        {preview && !cameraOn && (
          <div className="scan-preview">
            <img src={preview} alt="Vista previa del recibo" className="scan-page__preview" />
            {file && !scanning && !saved && (
              <button type="button" className="btn btn--ghost" onClick={() => processFile(file)}>
                Volver a analizar
              </button>
            )}
          </div>
        )}

        {scanning && <p className="scan-status">Analizando imagen…</p>}
        {error && <p className="auth-card__error">{error}</p>}

        {result && (
          <form className="scan-page__result" onSubmit={handleConfirm}>
            <h2>Revisa los datos detectados</h2>
            <p className="panel__empty">La lectura automática puede tener errores. Confirma antes de guardar.</p>
            <label className="field">
              <span>Tipo de movimiento</span>
              <select name="type" value={result.type} onChange={handleResultChange}>
                <option value="EXPENSE">Egreso</option>
                <option value="INCOME">Ingreso</option>
              </select>
            </label>
            <label className="field">
              <span>Monto</span>
              <input type="number" name="amount" value={result.amount} onChange={handleResultChange} required />
            </label>
            <label className="field">
              <span>Descripción</span>
              <input type="text" name="description" value={result.description} onChange={handleResultChange} required />
            </label>
            <label className="field">
              <span>Categoría</span>
              <input type="text" name="category" value={result.category} onChange={handleResultChange} />
            </label>
            <div className="scan-page__buttons">
              <button type="submit" className="btn btn--primary" disabled={saved}>
                {saved ? 'Guardado' : 'Guardar transacción'}
              </button>
              {saved && (
                <button type="button" className="btn btn--ghost" onClick={resetScan}>
                  Escanear otro recibo
                </button>
              )}
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

