import { genSaltSync, hashSync, compareSync } from 'bcrypt';

export class Crypto {
  encript(password: string): string {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

  compare(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}

const crypto = new Crypto();

export { crypto };
