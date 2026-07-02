import { GetCSRFToken } from './GetCSRFToken.command';
import { validate as isUUID } from 'uuid';

describe('GetCSRFToken Query', () => {
  let query: GetCSRFToken;

  beforeEach(() => {
    query = new GetCSRFToken();
  });

  it('should return a string', () => {
    const result = query.implementation();
    expect(typeof result).toBe('string');
  });

  it('should return a valid UUID v4', () => {
    const result = query.implementation();
    // Перевіряємо, чи рядок відповідає формату UUID
    expect(isUUID(result)).toBe(true);
  });

  it('should return unique tokens on every call', () => {
    const token1 = query.implementation();
    const token2 = query.implementation();

    expect(token1).not.toBe(token2);
  });
});
