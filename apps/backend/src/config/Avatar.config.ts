import { registerAs } from '@nestjs/config';

export default registerAs('avatar', () => ({
  list: process.env.AVATAR_LIST?.split(','),
}));
