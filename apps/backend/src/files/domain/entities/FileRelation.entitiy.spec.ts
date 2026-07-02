import { FileRelationEntity } from '@/files/domain/entities/FileRelation.entity';
import { FileEntity } from '@/files/domain/entities/File.entity';
import { RelationString } from '@/files/domain/objects/RelationSlots';
import { UserEntity } from '@/authorization/domain/entities/User.entity';
import { MimeType } from '../objects/MimeType.object';

describe('FileRelationEntity', () => {
  const file = FileEntity.create(100, new MimeType('image/png'));
  const slot = RelationString.define('user:avatar');
  const fileWithSlot = FileEntity.create(100, new MimeType('image/png'), slot);

  describe('create', () => {
    it('should create relation with id and file', () => {
      const rel = FileRelationEntity.create(file);

      expect(rel.id).toBeDefined();
      expect(rel.file).toBe(file);
    });
  });

  describe('slot validation', () => {
    it('should throw if slot does not match file slot', () => {
      const fileWithSlot = FileEntity.create(
        100,
        { value: 'image/png', fileFormat: 'png' } as any,
        RelationString.define('user:avatar'),
      );

      const rel = FileRelationEntity.create(fileWithSlot);

      expect(() => {
        rel.slot = 'user:wrong-slot';
      }).toThrow();
    });

    it('should set valid slot', () => {
      const fileWithSlot = FileEntity.create(
        100,
        new MimeType('image/png'),
        slot,
      );

      const rel = FileRelationEntity.create(fileWithSlot);

      rel.slot = 'user:avatar';

      expect(rel.slot).toBe('user:avatar');
    });
  });

  describe('entity exclusivity rules', () => {
    it('should prevent slot mismatch with user family', () => {
      const fileWithSlot = FileEntity.create(
        100,
        { value: 'image/png', fileFormat: 'png' } as any,
        RelationString.define('user:avatar'),
      );

      const rel = FileRelationEntity.create(fileWithSlot);

      const user = {} as UserEntity;

      rel.user = user;

      expect(() => {
        rel.slot = 'competition:banner';
      }).toThrow();
    });

    it('should allow valid user + slot pairing', () => {
      const rel = FileRelationEntity.create(fileWithSlot);

      rel.user = {} as UserEntity;
      rel.slot = RelationString.define('user:avatar');

      expect(rel.user).toBeDefined();
      expect(rel.slot).toBe('user:avatar');
    });
  });

  describe('slot getter safety', () => {
    it('should throw if slot is missing', () => {
      const rel = FileRelationEntity.create(file);

      expect(() => rel.slot).toThrow();
    });
  });

  describe('toJSON', () => {
    it('should serialize correctly', () => {
      const fileWithSlot = FileEntity.create(
        100,
        new MimeType('image/png'),
        RelationString.define('user:avatar'),
      );
      const rel = FileRelationEntity.create(fileWithSlot);

      rel.user = { id: 'u1' } as any;

      rel.slot = RelationString.define('user:avatar');
      const json = rel.toJSON();

      expect(json.id).toBe(rel.id);
      expect(json.file).toBe(fileWithSlot);
      expect(json.user).toBe('u1');
    });
  });
});
