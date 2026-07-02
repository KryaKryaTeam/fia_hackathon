import { Age } from './Age.object';
import { ApiError } from '@/error/ApiError';

describe('Age Value Object', () => {
  describe('constructor', () => {
    it('should create an Age instance with a valid value', () => {
      const age = new Age(25);
      expect(age.value).toBe(25);
    });

    it('should throw DomainError if age is less than 14', () => {
      expect(() => new Age(9)).toThrow(ApiError);
    });

    it('should throw DomainError if age is more than 120', () => {
      expect(() => new Age(190)).toThrow(ApiError);
    });
  });

  describe('fromDate (Static Factory)', () => {
    // Фіксуємо "сьогоднішню" дату для стабільності тестів
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-05-20').getTime());
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should correctly calculate age when birthday has already occurred this year', () => {
      const birthDate = new Date('2000-01-01');
      const age = Age.fromDate(birthDate);
      expect(age.value).toBe(24);
    });

    it('should correctly calculate age when birthday is today', () => {
      const birthDate = new Date('2000-05-20');
      const age = Age.fromDate(birthDate);
      expect(age.value).toBe(24);
    });

    it('should correctly calculate age when birthday has not yet occurred this year', () => {
      const birthDate = new Date('2000-12-31');
      const age = Age.fromDate(birthDate);
      expect(age.value).toBe(23);
    });

    it('should throw error if calculated age is below 14', () => {
      const birthDate = new Date(Date.now() - 410240376000);
      expect(() => Age.fromDate(birthDate)).toThrow();
    });

    it('should handle string date input correctly', () => {
      const age = Age.fromDate('1990-01-01' as any);
      expect(age.value).toBe(34);
    });
  });
});
