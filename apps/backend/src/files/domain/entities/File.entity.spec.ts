import { FileEntity } from '@/files/domain/entities/File.entity';
import { MimeType } from '@/files/domain/objects/MimeType.object';
import { RelationString } from '@/files/domain/objects/RelationSlots';

describe('FileEntity', () => {
  const mimeType = new MimeType('image/png');
  const slot = RelationString.define('competition:banner');

  describe('create', () => {
    it('should create file with generated url', () => {
      const file = FileEntity.create(1234, mimeType, slot);

      expect(file).toBeDefined();
      expect(file.url).toContain('.');
      expect(file.mimeType).toBe(mimeType);
      expect(file.slot).toBe(slot);
      expect(file.size).toBe(1234);
    });
  });

  describe('load', () => {
    it('should load file entity from plain object', () => {
      const file = FileEntity.load({
        url: 'abc.png',
        size: 100,
        slot,
        mimeType,
      });

      expect(file.url).toBe('abc.png');
      expect(file.size).toBe(100);
      expect(file.mimeType).toBe(mimeType);
      expect(file.slot).toBe(slot);
    });
  });

  describe('size', () => {
    it('should return size or 0 if null', () => {
      const file = FileEntity.create(null, mimeType);

      expect(file.size).toBe(0);
    });

    it('should allow setting size only once', () => {
      const file = FileEntity.create(null, mimeType);

      file.size = 500;

      expect(file.size).toBe(500);

      expect(() => {
        file.size = 1000;
      }).toThrow();
    });
  });

  describe('slot', () => {
    it('should throw if slot is missing', () => {
      const file = FileEntity.create(100, mimeType);

      expect(() => file.slot).toThrow();
    });

    it('should allow setting slot only once', () => {
      const file = FileEntity.create(100, mimeType);

      file.slot = slot;

      expect(file.slot).toBe(slot);

      expect(() => {
        file.slot = slot;
      }).toThrow();
    });
  });

  describe('immutability rules', () => {
    it('should prevent overwriting metadata after initial set', () => {
      const file = FileEntity.create(100, mimeType);

      expect(() => {
        file.size = 300;
      }).toThrow();
    });
  });

  describe('toJSON', () => {
    it('should serialize correctly', () => {
      const file = FileEntity.create(1234, mimeType, slot);

      const json = file.toJSON();

      expect(json.url).toBe(file.url);
      expect(json.size).toBe(file.size);
      expect(json.mimeType).toBe(mimeType.value);
      expect(json.slot).toBe(slot.value);
    });
  });
});
