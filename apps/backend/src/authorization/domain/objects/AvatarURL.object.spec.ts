import { AvatarURL } from './AvatarURL.object';
import { ApiError } from '@/error/ApiError';

describe('AvatarURL Value Object', () => {
  describe('create', () => {
    it('should create an instance with a valid https URL', () => {
      const url = 'https://example.com/avatar.png';
      const avatar = AvatarURL.create(url);

      expect(avatar).toBeInstanceOf(AvatarURL);
      expect(avatar.value).toBe(url);
    });

    it('should create an instance with a valid http URL', () => {
      const url = 'http://example.com/avatar.png';
      const avatar = AvatarURL.create(url);

      expect(avatar.value).toBe(url);
    });

    it('should throw DomainError if URL does not contain http/https', () => {
      const invalidUrl = 'ftp://files.com/image.jpg';

      expect(() => AvatarURL.create(invalidUrl)).toThrow(ApiError);
    });
  });

  describe('generate', () => {
    it('should return one of the provided URLs', () => {
      const list = [
        'https://api.dicebear.com/1.svg',
        'https://api.dicebear.com/2.svg',
        'https://api.dicebear.com/3.svg',
      ];

      const avatar = AvatarURL.generate(list);

      expect(list).toContain(avatar.value);
    });

    it('should handle a list with a single element', () => {
      const list = ['https://single-avatar.png'];
      const avatar = AvatarURL.generate(list);

      expect(avatar.value).toBe('https://single-avatar.png');
    });

    it('should be unpredictable (random)', () => {
      const list = ['url_0', 'url_1', 'url_2'];

      const spy = jest.spyOn(Math, 'random');

      spy.mockReturnValue(0.99);
      expect(AvatarURL.generate(list).value).toBe('url_2');

      spy.mockReturnValue(0.01);
      expect(AvatarURL.generate(list).value).toBe('url_0');

      spy.mockRestore();
    });
  });
});
