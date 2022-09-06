import { createHash } from 'crypto';

export class Hash {
  generate() {
    return createHash('');
  }
}

export const hash = new Hash();
