import { validate, version } from 'uuid';
import { uuid } from '@app/utils/uuid';

describe('UUID Utils', () => {
  it('should generate a valid id', () => {
    const id = uuid.generate();

    expect(id.length).toBe(36);
    expect(validate(id)).toBeTruthy();
    expect(version(id)).toBe(4);
  });

  it('should validate a valid id', () => {
    const id = uuid.generate();
    const isValid = uuid.isValid(id);

    expect(isValid).toBeTruthy();
  });

  it('should validate a invalid id', () => {
    const invalidId = 'aas1da5sd1a6s54';
    expect(uuid.isValid(invalidId)).toBeFalsy();
  });
});
