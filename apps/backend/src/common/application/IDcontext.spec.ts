import { EntityManager } from 'typeorm';
import { IDBContext } from './IDBcontext';

export const createMockDBContext = (): jest.Mocked<IDBContext> => {
  const mockManager = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  } as unknown as jest.Mocked<EntityManager>;

  return {
    manager: mockManager,
    startTransaction: jest.fn().mockResolvedValue(undefined),
    rollbackTransaction: jest.fn().mockResolvedValue(undefined),
    commitTransaction: jest.fn().mockResolvedValue(undefined),
  };
};

describe('DBContext', () => {
  it('declareted', () => {});
});
