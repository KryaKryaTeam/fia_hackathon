import { DeleteGarbageCommand } from '@/files/application/useCases/DeleteGarbage.command';

describe('DeleteGarbageCommand', () => {
  const fileRepository = {
    deleteFilesWithNoRelation: jest.fn(),
  };

  const loadFileService = {
    deleteFile: jest.fn(),
  };

  const dbContextMock = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
  };

  const eventDispatcherMock = {
    dispatchEvents: jest.fn(),
  };

  const command = new DeleteGarbageCommand();
  (command as any).fileRepository = fileRepository;
  (command as any).loadFileService = loadFileService;
  (command as any).DBContext = dbContextMock;
  (command as any).eventDispatcher = eventDispatcherMock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete all files successfully', async () => {
    fileRepository.deleteFilesWithNoRelation.mockResolvedValue([
      'file1',
      'file2',
    ]);

    loadFileService.deleteFile.mockResolvedValue(undefined);

    const result = await command.execute();

    expect(result.numberOfDeleted).toBe(2);
    expect(result.failedToDelete).toBe(0);

    expect(loadFileService.deleteFile).toHaveBeenCalledTimes(2);

    expect(dbContextMock.startTransaction).toHaveBeenCalled();
    expect(dbContextMock.commitTransaction).toHaveBeenCalled();
    expect(eventDispatcherMock.dispatchEvents).toHaveBeenCalled();
  });

  it('should count failed deletions correctly', async () => {
    fileRepository.deleteFilesWithNoRelation.mockResolvedValue([
      'file1',
      'file2',
    ]);

    loadFileService.deleteFile
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('fail'));

    const result = await command.execute();

    expect(result.numberOfDeleted).toBe(1);
    expect(result.failedToDelete).toBe(1);

    expect(dbContextMock.startTransaction).toHaveBeenCalled();
    expect(dbContextMock.commitTransaction).toHaveBeenCalled();
  });

  it('should handle empty list', async () => {
    fileRepository.deleteFilesWithNoRelation.mockResolvedValue([]);

    const result = await command.execute();

    expect(result.numberOfDeleted).toBe(0);
    expect(result.failedToDelete).toBe(0);

    expect(dbContextMock.startTransaction).toHaveBeenCalled();
    expect(dbContextMock.commitTransaction).toHaveBeenCalled();
  });
});
