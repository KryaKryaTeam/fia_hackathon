import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  return {
    PORT: process.env.APP_PORT || 3000,
    BASE_URL: process.env.APP_BASE_URL || 'http://localhost:3000/',
    csrfProtectionEnabled: process.env.CSRF_PROTECTION_ENABLED == 'TRUE',
  };
});
