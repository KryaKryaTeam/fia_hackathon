// get-users-by-email.query.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { GetUsersByEmailQuery } from '@/authorization/application/useCases/GetUsersByEmail.query';
import { BaseTokens, ReposTokens } from '@/common/Tokens';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockUserRepository = {
  getPageOfUsers: jest.fn(),
  getUsersWithSimillarEmailByPages: jest.fn(),
};

// A tiny factory so tests don't repeat themselves like a broken record
const makeUser = (email: string) => ({
  forAdminList: { id: 'uuid-1', email, role: 'user' },
});

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('GetUsersByEmailQuery', () => {
  let query: GetUsersByEmailQuery;

  beforeEach(async () => {
    const mockEventDispatcher = {
      dispatchEvents: jest.fn(),
    };

    const mockDbContext = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUsersByEmailQuery,
        { provide: ReposTokens.UserRepository, useValue: mockUserRepository },
        { provide: BaseTokens.EventDispatcher, useValue: mockEventDispatcher },
        { provide: BaseTokens.DBContext, useValue: mockDbContext },
      ],
    }).compile();

    query = module.get(GetUsersByEmailQuery);
    jest.clearAllMocks();
  });

  // ─── Branch 1: no email / email too short → getPageOfUsers ──────────────────

  describe('when email is absent or shorter than 3 chars', () => {
    const shortCases = [
      { label: 'email is undefined', input: { page: 1, email: undefined } },
      { label: 'email is empty string', input: { page: 1, email: '' } },
      { label: 'email is 1 char', input: { page: 1, email: 'a' } },
      { label: 'email is 2 chars', input: { page: 1, email: 'ab' } },
    ];

    shortCases.forEach(({ label, input }) => {
      describe(label, () => {
        it('should call getPageOfUsers with the correct page', async () => {
          mockUserRepository.getPageOfUsers.mockResolvedValue([
            makeUser('x@x.com'),
          ]);

          await query.execute(input);

          expect(mockUserRepository.getPageOfUsers).toHaveBeenCalledWith(
            input.page,
          );
          expect(
            mockUserRepository.getUsersWithSimillarEmailByPages,
          ).not.toHaveBeenCalled();
        });

        it('should return mapped forAdminList entries', async () => {
          const fakeUsers = [makeUser('a@a.com'), makeUser('b@b.com')];
          mockUserRepository.getPageOfUsers.mockResolvedValue(fakeUsers);

          const result = await query.execute(input);

          expect(result).toEqual(fakeUsers.map((u) => u.forAdminList));
        });

        it('should throw PAGE_IS_EMPTY when repo returns empty array', async () => {
          mockUserRepository.getPageOfUsers.mockResolvedValue([]);

          await expect(query.execute(input)).rejects.toThrow();
        });

        it('should throw PAGE_IS_EMPTY when repo returns null', async () => {
          mockUserRepository.getPageOfUsers.mockResolvedValue(null);

          await expect(query.execute(input)).rejects.toThrow();
        });
      });
    });
  });

  // ─── Branch 2: email ≥ 3 chars → getUsersWithSimillarEmailByPages ───────────

  describe('when email is 3+ chars', () => {
    const input = { page: 2, email: 'jon' }; // exactly 3 — the boundary lives here

    it('should call getUsersWithSimillarEmailByPages with page and email', async () => {
      mockUserRepository.getUsersWithSimillarEmailByPages.mockResolvedValue([
        makeUser('jon@x.com'),
      ]);

      await query.execute(input);

      expect(
        mockUserRepository.getUsersWithSimillarEmailByPages,
      ).toHaveBeenCalledWith(input.page, input.email);
      expect(mockUserRepository.getPageOfUsers).not.toHaveBeenCalled();
    });

    it('should return mapped forAdminList entries', async () => {
      const fakeUsers = [makeUser('jon@doe.com')];
      mockUserRepository.getUsersWithSimillarEmailByPages.mockResolvedValue(
        fakeUsers,
      );

      const result = await query.execute(input);

      expect(result).toEqual(fakeUsers.map((u) => u.forAdminList));
    });

    it('should throw PAGE_IS_EMPTY when repo returns empty array', async () => {
      mockUserRepository.getUsersWithSimillarEmailByPages.mockResolvedValue([]);

      await expect(query.execute(input)).rejects.toThrow();
    });

    it('should throw PAGE_IS_EMPTY when repo returns null', async () => {
      mockUserRepository.getUsersWithSimillarEmailByPages.mockResolvedValue(
        null,
      );

      await expect(query.execute(input)).rejects.toThrow();
    });

    it('should also work for email longer than 3 chars', async () => {
      const longInput = { page: 1, email: 'john@example.com' };
      mockUserRepository.getUsersWithSimillarEmailByPages.mockResolvedValue([
        makeUser('john@example.com'),
      ]);

      await query.execute(longInput);

      expect(
        mockUserRepository.getUsersWithSimillarEmailByPages,
      ).toHaveBeenCalledWith(longInput.page, longInput.email);
    });
  });
});
