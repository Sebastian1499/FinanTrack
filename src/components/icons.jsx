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

// Marcas reconocibles de redes (formas simplificadas, no bitmaps con derechos de autor).
export function GithubIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  );
}

export function InstagramIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ig-grad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#ffb703" />
          <stop offset="0.5" stopColor="#ef476f" />
          <stop offset="1" stopColor="#7b2ff7" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="url(#ig-grad)" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="url(#ig-grad)" strokeWidth="2" />
      <circle cx="17.3" cy="6.7" r="1.3" fill="url(#ig-grad)" />
    </svg>
  );
}

export function LinkedinIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#0a66c2" />
      <rect x="5" y="9.5" width="3" height="9.5" fill="#fff" />
      <circle cx="6.5" cy="5.8" r="1.8" fill="#fff" />
      <path
        d="M11 9.5h3v1.4c.6-1 1.7-1.7 3.1-1.7 2.4 0 3.9 1.6 3.9 4.4v5.4h-3v-4.8c0-1.3-.5-2.2-1.7-2.2-1 0-1.6.7-1.8 1.3-.1.2-.1.6-.1.9v4.8h-3z"
        fill="#fff"
      />
    </svg>
  );
}

export function NewsIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="15" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <rect x="17" y="8" width="4" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <line x1="6.5" y1="8.5" x2="14.5" y2="8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="6.5" y1="12" x2="14.5" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="6.5" y1="15.5" x2="11" y2="15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
