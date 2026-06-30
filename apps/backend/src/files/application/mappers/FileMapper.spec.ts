import { FileMapper } from '@/files/application/mappers/FileMapper';
import { InternalFile } from '@/files/domain/objects/InternalFile.object';
import { MimeType } from '@/files/domain/objects/MimeType.object';
import { RelationString } from '@/files/domain/objects/RelationSlots';

describe('FileMapper', () => {
  const mapper = new FileMapper();

  const schema = {
    url: InternalFile.define('test', 'user:avatar', 'user:avatar').url,
    mimeType: new MimeType('image/png'),
    size: 1234,
    // slot: RelationString.define('user:avatar'),
    slot: 'user:avatar',
  } as any;

  describe('toEntity', () => {
    it('should map schema to entity correctly', () => {
      const entity = mapper.toEntity(schema);

      expect(entity.url).toBe(schema.url);
      expect(entity.size).toBe(schema.size);
      expect(entity.mimeType).toBeInstanceOf(MimeType);
      expect(entity.mimeType.value).toBe(schema.mimeType);
      expect(entity.slot).toBeInstanceOf(RelationString);
      expect(entity.slot.value).toBe(schema.slot);
    });
  });

  describe('toSchema', () => {
    it('should map entity back to schema correctly', () => {
      const entity = mapper.toEntity(schema);

      const result = mapper.toSchema(entity);

      expect(result).toEqual({
        url: schema.url,
        size: schema.size,
        mimeType: schema.mimeType,
        slot: schema.slot,
      });
    });
  });

  describe('round-trip', () => {
    it('should preserve data through full cycle', () => {
      const entity = mapper.toEntity(schema);
      const back = mapper.toSchema(entity);
      const entity2 = mapper.toEntity(back);

      expect(entity2.url).toBe(entity.url);
      expect(entity2.size).toBe(entity.size);
      expect(entity2.mimeType.value).toBe(entity.mimeType.value);
      expect(entity2.slot.value).toBe(entity.slot.value);
    });
  });
});
