import { Username } from './Username.object';
import { ApiError } from '@/error/ApiError';

describe('Username Value Object', () => {
  describe('create', () => {
    it('should create a valid username', () => {
      const validName = 'cool-developer-2024';
      const username = Username.create(validName);

      expect(username.value).toBe(validName);
    });

    it('should throw if username is too short (less than 8)', () => {
      expect(() => Username.create('short')).toThrow(ApiError);
    });

    it('should throw if username is too long (more than 50)', () => {
      const longName = 'a'.repeat(51);
      expect(() => Username.create(longName)).toThrow(ApiError);
    });

    it('should throw if username starts with an underscore', () => {
      expect(() => Username.create('_admin_user')).toThrow(ApiError);
    });
  });

  describe('generate', () => {
    const adjectives = ['brave', 'fast'];
    const animals = ['tiger', 'eagle'];

    it('should generate a username in the correct format', () => {
      const username = Username.generate(adjectives, animals);

      // Перевірка формату: слово-слово-число
      expect(username.value).toMatch(/^[a-z]+-[a-z]+-\d{1,3}$/);
    });

    it('should pick elements from the provided arrays', () => {
      const username = Username.generate(['onlyAdj'], ['onlyAnimal']);

      expect(username.value).toContain('onlyAdj-onlyAnimal');
    });

    it('should be random', () => {
      const spy = jest.spyOn(Math, 'random');

      // Симулюємо вибір перших елементів (0.1) та конкретного суфікса
      spy.mockReturnValue(0.1);
      const username = Username.generate(adjectives, animals);

      expect(username.value).toBe('brave-tiger-100');

      spy.mockRestore();
    });
  });
});
