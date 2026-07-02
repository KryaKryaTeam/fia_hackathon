import { GetLinkQuery } from '@/files/application/useCases/GetLinkQuery';

describe('GetLinkQuery', () => {
  const fileRepository = {
    findByUrl: jest.fn(),
  };

  const loadFileService = {
    getLink: jest.fn(),
  };

  const eventDispatcher = {
    dispatchEvents: jest.fn(),
  };

  const query = new GetLinkQuery();
  (query as any).fileRepository = fileRepository;
  (query as any).loadFileService = loadFileService;
  (query as any).eventDispatcher = eventDispatcher;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return link for existing file', async () => {
    const file = { id: 'f1', url: 'file.png' } as any;

    fileRepository.findByUrl.mockResolvedValue(file);
    loadFileService.getLink.mockResolvedValue('https://cdn/file.png');

    const result = await query.execute({ fileUrl: 'file.png' });

    expect(fileRepository.findByUrl).toHaveBeenCalledWith('file.png');
    expect(loadFileService.getLink).toHaveBeenCalledWith(file);
    expect(result).toBe('https://cdn/file.png');
  });

  it('should throw if file does not exist', async () => {
    fileRepository.findByUrl.mockResolvedValue(null);

    await expect(query.execute({ fileUrl: 'missing.png' })).rejects.toThrow();

    expect(loadFileService.getLink).not.toHaveBeenCalled();
  });
});
