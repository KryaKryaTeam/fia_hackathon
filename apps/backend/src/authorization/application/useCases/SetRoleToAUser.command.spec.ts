import { Test, TestingModule } from '@nestjs/testing';
import { SetRoleToAUserCommand } from '@/authorization/application/useCases/SetRoleToAUser.command';
import { BaseTokens, ReposTokens } from '@/common/Tokens';
import { RoleEnum } from '@/types/RoleEnum';

const mockUserRepository = {
  findById: jest.fn(),
  save: jest.fn(),
};

const mockEventDispatcher = {
  dispatch: jest.fn(),
  dispatchEvents: jest.fn(),
};

const makeUser = () => ({
  setRoleTo: jest.fn(),
  pullEvents: jest.fn(),
});

const mockDBContext = {
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
};

const fakeActor = { id: 'actor-uuid', role: RoleEnum.ADMIN } as any;

describe('SetRoleToAUserCommand', () => {
  let command: SetRoleToAUserCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SetRoleToAUserCommand,
        { provide: ReposTokens.UserRepository, useValue: mockUserRepository },
        { provide: BaseTokens.DBContext, useValue: mockDBContext },
        { provide: BaseTokens.EventDispatcher, useValue: mockEventDispatcher },
      ],
    }).compile();

    command = module.get(SetRoleToAUserCommand);

    jest.clearAllMocks();
  });

  describe('when user exists', () => {
    let fakeUser: ReturnType<typeof makeUser>;

    beforeEach(() => {
      fakeUser = makeUser();
      mockUserRepository.findById.mockResolvedValue(fakeUser);
      mockUserRepository.save.mockResolvedValue(undefined);
    });

    it('should call findById with the correct id', async () => {
      await command.execute({
        userToChangeId: 'user-uuid',
        actor: fakeActor,
        role: RoleEnum.ADMIN,
      });

      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-uuid');
    });

    it('should call setRoleTo with actor and role', async () => {
      await command.execute({
        userToChangeId: 'user-uuid',
        actor: fakeActor,
        role: RoleEnum.ADMIN,
      });

      expect(fakeUser.setRoleTo).toHaveBeenCalledWith(
        fakeActor,
        RoleEnum.ADMIN,
      );
    });

    it('should pull events after role is set', async () => {
      await command.execute({
        userToChangeId: 'user-uuid',
        actor: fakeActor,
        role: RoleEnum.ADMIN,
      });

      expect(fakeUser.pullEvents).toHaveBeenCalledWith(mockEventDispatcher);
    });

    it('should save the user after everything is done', async () => {
      await command.execute({
        userToChangeId: 'user-uuid',
        actor: fakeActor,
        role: RoleEnum.ADMIN,
      });

      expect(mockUserRepository.save).toHaveBeenCalledWith(fakeUser);
    });

    it('should call setRoleTo before pullEvents before save — order matters', async () => {
      const callOrder: string[] = [];

      fakeUser.setRoleTo.mockImplementation(() => callOrder.push('setRoleTo'));
      fakeUser.pullEvents.mockImplementation(() =>
        callOrder.push('pullEvents'),
      );
      mockUserRepository.save.mockImplementation(() => {
        callOrder.push('save');
      });

      await command.execute({
        userToChangeId: 'user-uuid',
        actor: fakeActor,
        role: RoleEnum.ADMIN,
      });

      expect(callOrder).toEqual(['setRoleTo', 'pullEvents', 'save']);
    });
  });

  describe('when user does not exist', () => {
    beforeEach(() => {
      mockUserRepository.findById.mockResolvedValue(null);
    });

    it('should throw when user is not found', async () => {
      await expect(
        command.execute({
          userToChangeId: 'ghost-uuid',
          actor: fakeActor,
          role: RoleEnum.ADMIN,
        }),
      ).rejects.toThrow();
    });

    it('should never touch save when user is not found', async () => {
      await expect(
        command.execute({
          userToChangeId: 'ghost-uuid',
          actor: fakeActor,
          role: RoleEnum.ADMIN,
        }),
      ).rejects.toThrow();

      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });
});
