// Iconos SVG originales (evitan depender de emoji genéricos).

export function LogoIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#0b1f3a" />
      <path
        d="M9 26 L16 18 L21 23 L31 11"
        stroke="#27c281"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M25 11 H31 V17" stroke="#ffb703" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="9" cy="26" r="2.6" fill="#ffb703" />
    </svg>
  );
}

export function ScanIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="10" height="3" rx="1.5" fill="#1b8a5a" />
      <rect x="3" y="3" width="3" height="10" rx="1.5" fill="#1b8a5a" />
      <rect x="27" y="3" width="10" height="3" rx="1.5" fill="#1b8a5a" />
      <rect x="34" y="3" width="3" height="10" rx="1.5" fill="#1b8a5a" />
      <rect x="3" y="34" width="10" height="3" rx="1.5" fill="#1b8a5a" />
      <rect x="3" y="27" width="3" height="10" rx="1.5" fill="#1b8a5a" />
      <rect x="27" y="34" width="10" height="3" rx="1.5" fill="#1b8a5a" />
      <rect x="34" y="27" width="3" height="10" rx="1.5" fill="#1b8a5a" />
      <rect x="9" y="14" width="22" height="14" rx="2" fill="#f0fdf4" stroke="#27c281" strokeWidth="1.5" />
      <line x1="12" y1="18" x2="28" y2="18" stroke="#27c281" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="22" x2="22" y2="22" stroke="#27c281" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="20.5" x2="37" y2="20.5" stroke="#ffb703" strokeWidth="1.5" />
    </svg>
  );
}

export function MLIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="4" fill="#1b8a5a" />
      <circle cx="10" cy="20" r="4" fill="#27c281" />
      <circle cx="10" cy="30" r="4" fill="#1b8a5a" />
      <circle cx="30" cy="15" r="4" fill="#ffb703" />
      <circle cx="30" cy="25" r="4" fill="#ffb703" />
      <path
        d="M13.5 9 L26.5 14 M13.5 11 L26.5 24 M13.5 20 L26.5 15 M13.5 21 L26.5 24 M13.5 29 L26.5 16 M13.5 31 L26.5 26"
        stroke="#0b1f3a"
        strokeWidth="1.2"
        opacity="0.5"
      />
    </svg>
  );
}

export function ChatIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="4" y="7" width="26" height="19" rx="6" fill="#1b8a5a" />
      <path d="M12 26 L9 33 L18 26 Z" fill="#1b8a5a" />
      <circle cx="12" cy="16.5" r="2" fill="#fff" />
      <circle cx="17" cy="16.5" r="2" fill="#fff" />
      <circle cx="22" cy="16.5" r="2" fill="#fff" />
      <path
        d="M28 6 L29.3 9.2 L32.5 10.5 L29.3 11.8 L28 15 L26.7 11.8 L23.5 10.5 L26.7 9.2 Z"
        fill="#ffb703"
      />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="17" cy="17" r="11" fill="none" stroke="#1b8a5a" strokeWidth="3.5" />
      <line x1="25" y1="25" x2="35" y2="35" stroke="#0b1f3a" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M11 18 L15 12 L19 16 L24 9" stroke="#ffb703" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
