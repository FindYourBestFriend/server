import { v4, validate, version } from 'uuid';

class UUID {
  generate(): string {
    return v4();
  }

  isValid(uuid: string): boolean {
    return validate(uuid) && version(uuid) === 4;
  }
}

const uuid = new UUID();

export { uuid };
