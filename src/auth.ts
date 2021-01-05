import { createHmac } from 'crypto';

export class Authenticator {
  private key: string;
  private secret: string;

  constructor(key: string, secret: string) {
    this.key = key;
    this.secret = secret;
  }

  /**
   * Generate a signature for a request body
   * @param body object containing the body of a request
   * @return signature object
   */
  signature(body: any) {
    let nonce = new Date().getTime();
    body = body || {};
    body.nonce = nonce;

    body = JSON.stringify(body);
    let signed = createHmac('sha512', this.secret);
    signed.update(body);

    return {
      key: this.key,
      body: body,
      sign: signed.digest('hex'),
    }
  }
}