import { Test, TestingModule } from '@nestjs/testing';
import { UpdateAdditionalDataCommand } from './UpdateAdditionalData.command';
import { BaseTokens, ReposTokens } from '@/common/Tokens';
import { IUserAdditionalData } from '@/authorization/domain/entities/User.entity';
import { createMockDBContext } from '@/common/application/IDcontext.spec';
import { createMockEventDispatcher } from '@/common/application/events/EventDispatcher';
import { ApiError } from '@/error/ApiError';

describe('UpdateAdditionalDataCommand', () => {
  let command: UpdateAdditionalDataCommand;

  // Створюємо мок репозиторію
  const mockUserRepository = {
    findById: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateAdditionalDataCommand,
        {
          provide: ReposTokens.UserRepository,
          useValue: mockUserRepository,
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

    command = module.get<UpdateAdditionalDataCommand>(
      UpdateAdditionalDataCommand,
    );
    jest.clearAllMocks();
  });

  it('should update additional data and save the user', async () => {
    const userId = 'user-123';
    const newData: IUserAdditionalData = {
      firstName: 'John',
      lastName: 'Doe',
    };

    // Створюємо об'єкт-муляж для сутності користувача
    const mockUserEntity = {
      id: userId,
      additionalData: {}, // початкові дані
    };

    mockUserRepository.findById.mockResolvedValue(mockUserEntity);
    mockUserRepository.save.mockResolvedValue(undefined);

    await command.implementation({ id: userId, data: newData });

    // Перевіряємо, чи був викликаний пошук
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);

    // ПЕРЕВІРКА: чи були дані присвоєні сутності перед збереженням
    expect(mockUserEntity.additionalData).toEqual(newData);

    // Перевіряємо, чи було викликано збереження саме цієї сутності
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUserEntity);
  });

  it('should throw DomainError if user for update is not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    const call = command.implementation({
      id: 'ghost-id',
      data: {} as IUserAdditionalData,
    });

    await expect(call).rejects.toThrow(ApiError);
    await expect(call).rejects.toThrow();

    // Збереження не має викликатися
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});
