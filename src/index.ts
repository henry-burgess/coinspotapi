import { request } from 'https';
import { Authenticator } from './auth';

// Useful constants
const GET = 'GET';
const POST = 'POST';
const HOST = 'www.coinspot.com.au';

const PATHS = {
  BALANCES: '/api/my/balances',
  LATEST: 'https://www.coinspot.com.au/pubapi/latest',
};

const BALANCE_LENGTH = 8;
const VALUE_LENGTH = 3;

export class CoinSpot {
  private key;
  private secret;
  private authenticator;

  constructor(key: string, secret: string) {
    this.key = key;
    this.secret = secret;

    this.authenticator = new Authenticator(this.key, this.secret);
  }

  generateOptions(auth: any, path: string, method: string) {
    return {
      rejectUnauthorized: false,
      method: method,
      host: HOST,
      port: 443,
      path: path,
      headers: {
        'Content-Type': 'application/json',
        'sign': auth.signature,
        'key': auth.key,
      }
    }
  }

  execute(auth: any, path: string, method: string, callback: Function) {
    let options = this.generateOptions(auth, path, method);
    let req = request(options, function(res) {
      let data = '';
      res.on('data', function(chunk: string) {
        data += chunk;
      });
      res.on('end', function(chunk: string) {
        callback(null, data);
      });
    });
    req.on('error', function(e) {
      callback(e, '');
    });
    if (method === POST) {
      req.write(auth.body);
    }
    req.end();
  }

  balance(coin = 'btc', callback: Function) {

  }
}
