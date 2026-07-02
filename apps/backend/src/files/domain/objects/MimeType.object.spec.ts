import { MimeType } from '@/files/domain/objects/MimeType.object';

describe('MimeType', () => {
  it('should create mime type correctly', () => {
    const mime = new MimeType('image/png');

    expect(mime.value).toBe('image/png');
    expect(mime.fileFormat).toBe('png');
  });

  it('should extract file format correctly', () => {
    const mime = new MimeType('application/pdf');

    expect(mime.fileFormat).toBe('pdf');
  });

  it('should NOT throw if value is undefined', () => {
    expect(() => {
      new MimeType(undefined as any);
    }).not.toThrow();
  });

  it('should throw if value is empty string', () => {
    expect(() => {
      new MimeType('' as any);
    }).toThrow();
  });
});
