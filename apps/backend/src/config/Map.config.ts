import { registerAs } from '@nestjs/config';

export default registerAs('map', () => {
  return {
    apiKey: process.env.MAP_API_KEY,
  };
});
