const BASE_URL: string =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost');

export const URLEnum = {
  // --- AUTH ---
  LOGIN: `${BASE_URL}/auth/login?provider=GOOGLE`,
  CSRF: `${BASE_URL}/auth/csrf`,
  REFRESH: `${BASE_URL}/auth/refresh`,
} as const;
export default URLEnum;
