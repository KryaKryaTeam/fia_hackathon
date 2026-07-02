import { InternalFile } from '@/files/domain/objects/InternalFile.object';
import { FileEntity } from '@/files/domain/entities/File.entity';
import { RelationString } from '@/files/domain/objects/RelationSlots';

describe('InternalFile', () => {
  const slot = 'competition:avatar' as any;

  describe('define', () => {
    it('should create internal file with prefix if missing', () => {
      const file = InternalFile.define('abc.png', slot, slot);

      expect(file.value).toBe('internal_file:abc.png');
      expect(file.url).toBe('abc.png');
    });

    it('should keep prefix if already present', () => {
      const file = InternalFile.define('internal_file:abc.png', slot, slot);

      expect(file.value).toBe('internal_file:abc.png');
      expect(file.url).toBe('abc.png');
    });

    it('should throw if slot mismatch', () => {
      expect(() => {
        InternalFile.define(
          'abc.png',
          'user:avatar' as any,
          'competition:banner' as any,
        );
      }).toThrow();
    });
  });

  describe('fromFileEntity', () => {
    it('should create internal file from entity', () => {
      const fileEntity = FileEntity.create(
        100,
        { value: 'image/png', fileFormat: 'png' } as any,
        RelationString.define('competition:banner'),
      );

      const internal = InternalFile.fromFileEntity(
        fileEntity,
        'competition:banner' as any,
      );

      expect(internal.value).toContain('internal_file:');
      expect(internal.url).toBe(fileEntity.url);
    });

    it('should throw if file slot mismatch', () => {
      const fileEntity = FileEntity.create(
        100,
        { value: 'image/png', fileFormat: 'png' } as any,
        RelationString.define('user:avatar'),
      );

      expect(() => {
        InternalFile.fromFileEntity(fileEntity, 'competition:banner' as any);
      }).toThrow();
    });
  });

  describe('url getter', () => {
    it('should strip internal prefix', () => {
      const file = InternalFile.define('abc.png', slot, slot);

      expect(file.url).toBe('abc.png');
    });
  });
});
