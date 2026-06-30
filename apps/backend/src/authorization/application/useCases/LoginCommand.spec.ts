import { Test, TestingModule } from '@nestjs/testing';
import { LoginCommand } from './Login.command';
import { BaseTokens, ReposTokens, ServiceTokens } from '@/common/Tokens';
import { AuthorizationProviderTypes } from '@/types/AuthorizationProvidersTypes';
import { RoleEnum } from '@/types/RoleEnum';
import { createMockDBContext } from '@/common/application/IDcontext.spec';
import { createMockEventDispatcher } from '@/common/application/events/EventDispatcher';

describe('LoginCommand', () => {
  let command: LoginCommand;

  const mockAuthService = {
    authorize: jest.fn(),
  };
  const mockUserRepository = {
    save: jest.fn(),
    existsByEmail: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginCommand,
        {
          provide: ServiceTokens.AuthorizationProviderService,
          useValue: mockAuthService,
        },
        {
          provide: ReposTokens.UserRepository,
          useValue: mockUserRepository,
        },
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

    command = module.get<LoginCommand>(LoginCommand);
    jest.clearAllMocks();
  });

  it('should authorize, save user and return tokens', async () => {
    // Дані для входу
    const loginProps = {
      type: AuthorizationProviderTypes.GOOGLE,
      loginData: { code: 'some-google-code' },
    };

    // Мокаємо повернення користувача сервісом авторизації
    const mockUser = { id: 'user-123', role: RoleEnum.USER };
    mockAuthService.authorize.mockResolvedValue({
      user: mockUser,
      existsUser: true,
    });

    // Мокаємо підпис токенів
    const mockTokens = { accessToken: 'at', refreshToken: 'rt' };
    mockJwtService.sign.mockReturnValue(mockTokens);

    // Виконуємо команду
    const result = await command.implementation(loginProps);

    // ПЕРЕВІРКИ:
    // 1. Чи викликана авторизація з правильними параметрами?
    expect(mockAuthService.authorize).toHaveBeenCalledWith(
      loginProps.type,
      loginProps.loginData,
    );

    // 2. Чи збережено користувача?
    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);

    // 3. Чи підписано JWT з правильним payload?
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      role: mockUser.role,
      sub: mockUser.id,
    });

    // 4. Чи правильний результат повертає команда?
    expect(result).toEqual({
      accessToken: 'at',
      refreshToken: 'rt',
      userExists: true,
    });
  });
});
