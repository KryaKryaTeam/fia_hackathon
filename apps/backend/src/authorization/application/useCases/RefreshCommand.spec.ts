import { Test, TestingModule } from '@nestjs/testing';
import { RefreshCommand } from './Refresh.command';
import { BaseTokens, ServiceTokens } from '@/common/Tokens';
import { IJWTPair } from '@/types/JWTPair';
import { createMockEventDispatcher } from '@/common/application/events/EventDispatcher';
import { createMockDBContext } from '@/common/application/IDcontext.spec';

describe('RefreshCommand', () => {
  let command: RefreshCommand;

  const mockJwtService = {
    refresh: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshCommand,
        {
          provide: ServiceTokens.JWTService,
          useValue: mockJwtService,
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

    command = module.get<RefreshCommand>(RefreshCommand);
    jest.clearAllMocks();
  });

  it('should call jwtTokenService.refresh with the provided token and return a new pair', async () => {
    const oldRefreshToken = 'old-refresh-token';
    const newPair: IJWTPair = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };

    // Налаштовуємо мок
    mockJwtService.refresh.mockResolvedValue(newPair);

    const result = await command.implementation(oldRefreshToken);

    // Перевіряємо взаємодію
    expect(mockJwtService.refresh).toHaveBeenCalledWith(oldRefreshToken);
    expect(mockJwtService.refresh).toHaveBeenCalledTimes(1);
    expect(result).toEqual(newPair);
  });

  it('should propagate errors from the jwtTokenService', async () => {
    const invalidToken = 'invalid-token';
    mockJwtService.refresh.mockRejectedValue(
      new Error('Invalid refresh token'),
    );

    await expect(command.implementation(invalidToken)).rejects.toThrow(
      'Invalid refresh token',
    );
  });
});
