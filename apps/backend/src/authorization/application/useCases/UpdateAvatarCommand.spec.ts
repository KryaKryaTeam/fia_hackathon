import { Test, TestingModule } from '@nestjs/testing';
import { UpdateAvatarCommand } from './UpdateAvatar.command';
import { BaseTokens, ReposTokens, ServiceTokens } from '@/common/Tokens';
import { createMockDBContext } from '@/common/application/IDcontext.spec';
import { createMockEventDispatcher } from '@/common/application/events/EventDispatcher';

describe('UpdateAvatarCommand', () => {
  let command: UpdateAvatarCommand;

  // Мок репозиторію
  const mockUserRepository = {
    findById: jest.fn(),
    save: jest.fn(),
  };

  const mockFileRepository = {
    findByUrl: jest.fn(),
    save: jest.fn(),
  };

  const mockFileLinkerService = {
    linkAvatarToUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateAvatarCommand,
        {
          provide: ReposTokens.UserRepository,
          useValue: mockUserRepository,
        },
        { provide: ReposTokens.FileRepository, useValue: mockFileRepository },
        {
          provide: ServiceTokens.FileLinkerService,
          useValue: mockFileLinkerService,
        },
        {
          provide: BaseTokens.DBContext,
          useValue: createMockDBContext(),
        },
        {
          provide: BaseTokens.EventDispatcher,
          useValue: createMockEventDispatcher(),
        },
      ],
    }).compile();

    command = module.get<UpdateAvatarCommand>(UpdateAvatarCommand);
    jest.clearAllMocks();
  });

  it('should update avatar and save user when data is valid', async () => {
    const userId = 'user-123';
    const newAvatarStr = 'internal_file:cdn.image.com/new-avatar.png';

    // Створюємо мок сутності з методом changeAvatarURL
    const mockUserEntity = {
      id: userId,
      changeAvatarURL: jest.fn(),
    };

    const mockFile = {
      url: newAvatarStr,
    };

    mockUserRepository.findById.mockResolvedValue(mockUserEntity);
    mockFileRepository.findByUrl.mockResolvedValue(mockFile);

    await command.implementation({ id: userId, avatar: newAvatarStr });

    // 1. Перевіряємо, чи знайшли юзера
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockFileRepository.findByUrl).toHaveBeenCalledWith(newAvatarStr);

    // 2. Перевіряємо, чи викликано метод сутності з правильним Value Object
    // Ми використовують expect.any(AvatarURL) або перевіряємо значення всередині
    expect(mockUserEntity.changeAvatarURL).toHaveBeenCalledWith(
      expect.objectContaining({ value: newAvatarStr }),
    );

    // 3. Перевіряємо збереження
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUserEntity);
  });

  it('should throw if user does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      command.implementation({ id: 'none', avatar: 'https://valid.url' }),
    ).rejects.toThrow();
  });
});
