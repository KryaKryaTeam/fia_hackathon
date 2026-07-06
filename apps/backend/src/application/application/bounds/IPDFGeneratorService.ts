import { Readable } from 'node:stream';

export interface IPDFGeneratorService {
  generate: (text: string) => Promise<Readable>;
}
