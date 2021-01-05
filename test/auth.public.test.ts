import { Authenticator } from '../src/auth';

let authenticator: Authenticator;

beforeAll(() => {
  authenticator = new Authenticator('key', 'secret');
});

describe('signature body', () => {
  it('is not empty', () => {
    let signature = authenticator.signature({});
    expect(signature.body).not.toBe({});
  });
});
