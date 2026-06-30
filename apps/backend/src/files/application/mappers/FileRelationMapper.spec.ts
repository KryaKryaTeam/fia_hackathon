import { FileRelationMapper } from '@/files/application/mappers/FileRelationMapper';
import { FileRelationEntity } from '@/files/domain/entities/FileRelation.entity';
import { FileRelation } from '@/schemas/FileRelation.schema';

describe('FileRelationMapper', () => {
  const fileMapper = {
    toEntity: jest.fn(),
    toSchema: jest.fn(),
  };

  const userMapper = {
    toEntity: jest.fn(),
    toSchema: jest.fn(),
  };

  const competitionMapper = {
    toEntity: jest.fn(),
    toSchema: jest.fn(),
  };

  const mapper = new FileRelationMapper(userMapper as any, fileMapper as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('toEntity', () => {
    it('should map full schema to entity using sub-mappers', () => {
      fileMapper.toEntity.mockReturnValue({ id: 'file1' });
      userMapper.toEntity.mockReturnValue({ id: 'user1' });
      competitionMapper.toEntity.mockReturnValue({ id: 'comp1' });
      const schema = {
        id: 'rel1',
        file: { raw: 'file' },
        user: { raw: 'user' },
        competition: { raw: 'comp' },
        slot: 'competition:avatar',
      } as unknown as FileRelation;

      const entity = mapper.toEntity(schema);

      expect(fileMapper.toEntity).toHaveBeenCalled();
      expect(userMapper.toEntity).toHaveBeenCalled();
      expect(competitionMapper.toEntity).toHaveBeenCalled();

      expect(entity.id).toBe('rel1');
      expect(entity.slot).toBe('competition:avatar');
      expect(entity.slot.valueOf()).toBe('competition:avatar');
    });

    it('should handle optional fields', () => {
      fileMapper.toEntity.mockReturnValue({ id: 'file1' });

      const schema = {
        id: 'rel1',
        file: { raw: 'file' },
      } as unknown as FileRelation;

      const entity = mapper.toEntity(schema);

      expect(entity.file).toBeDefined();
      expect(entity.user).toBeUndefined();
    });
  });

  describe('toSchema', () => {
    it('should throw if entity is incomplete', () => {
      const entity = {
        id: 'rel1',
        filed: false, // triggers error
      } as unknown as FileRelationEntity;

      expect(() => mapper.toSchema(entity)).toThrow();
    });

    it('should map full entity to schema', () => {
      fileMapper.toSchema.mockReturnValue({ id: 'file-schema' });
      userMapper.toSchema.mockReturnValue({ id: 'user-schema' });
      competitionMapper.toSchema.mockReturnValue({ id: 'comp-schema' });

      const entity = {
        id: 'rel1',
        filed: true,
        file: { id: 'file1' },
        user: { id: 'user1' },
        competition: { id: 'comp1' },
        slot: 'file:avatar',
      } as unknown as FileRelationEntity;

      const result = mapper.toSchema(entity);

      expect(result.id).toBe('rel1');
      expect(result.file).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.slot).toBe('file:avatar');
    });

    it('should include foreign keys when mapping user and competition', () => {
      fileMapper.toSchema.mockReturnValue({});

      const entity = {
        id: 'rel1',
        filed: true,
        file: { id: 'file1' },
        user: { id: 'user1' },
        competition: { id: 'comp1' },
        slot: null,
      } as unknown as FileRelationEntity;

      const result = mapper.toSchema(entity);

      expect(result.user_id).toBe('user1');
    });
  });
});
