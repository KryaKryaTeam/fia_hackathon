import { LinkerApplicationService } from '@/files/application/services/Linker.appService';
import { RelationString } from '@/files/domain/objects/RelationSlots';
import { FileEntity } from '@/files/domain/entities/File.entity';
import { MimeType } from '@/files/domain/objects/MimeType.object';

describe('LinkerApplicationService', () => {
  const repo = {
    deleteRelationByUserAndScope: jest.fn(),
    deleteRelationByCompetitionAndScope: jest.fn(),
    save: jest.fn(),
  };

  const service = new LinkerApplicationService();
  (service as any).relationRepository = repo;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const user = { id: 'u1' } as any;
  const fileData = {
    mimeType: new MimeType('image/png'),
    size: 100,
    url: 'someUrl',
  };

  describe('linkAvatarToUser', () => {
    it('should unlink previous avatar and save new relation', async () => {
      const file = FileEntity.load({
        ...fileData,
        slot: RelationString.define('user:avatar'),
      });
      await service.linkAvatarToUser(file, user);

      expect(repo.deleteRelationByUserAndScope).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();

      const savedRelation = repo.save.mock.calls[0][0];

      expect(savedRelation.user).toBe(user);
      expect(savedRelation.file).toBe(file);
      expect(savedRelation.slot).toBeDefined();
    });
  });
});
