import { env } from 'next-runtime-env';

const BASE_URL: string =
  env('NEXT_PUBLIC_BACKEND_BASE_URL') ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost');

export const URLEnum = {
  // --- AUTH ---
  LOGIN: `${BASE_URL}/auth/login?provider=GOOGLE`,
  CSRF: `${BASE_URL}/auth/csrf`,
  REFRESH: `${BASE_URL}/auth/refresh`,
  LOGOUT: `${BASE_URL}/auth/logout`,

  // --- USER ---
  ME: `${BASE_URL}/user/me`,
  UPDATE_DATA: `${BASE_URL}/user/additional`,

  // --- APPLICATION ---
  CREATE_APPLICATION: `${BASE_URL}/application`,
} as const;
export default URLEnum;
