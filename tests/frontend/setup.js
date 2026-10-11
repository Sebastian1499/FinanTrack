import * as matchersModule from '@testing-library/jest-dom/matchers';

// "expect" es global gracias a vitest.config `globals: true` (ver vite.config.js).
// El paquete reexporta vía CommonJS, así que puede llegar envuelto en ".default".
expect.extend(matchersModule.default || matchersModule);
