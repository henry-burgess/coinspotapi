import { request } from 'https';
import { Authenticator } from './auth';

// Useful constants
const GET = 'GET';
const POST = 'POST';
const HOST = 'www.coinspot.com.au';

const PATHS = {
  BALANCES: '/api/my/balances',
  ORDERS: '/api/orders',
  LATEST: 'https://www.coinspot.com.au/pubapi/latest',
};

// const BALANCE_LENGTH = 8;
// const VALUE_LENGTH = 3;

/**
 * Main class to handle API queries.
 */
export class CoinSpot {
  private key: string;
  private secret: string;
  private authenticator: Authenticator;

  constructor(key: string, secret: string) {
    this.key = key;
    this.secret = secret;

    this.authenticator = new Authenticator(this.key, this.secret);
  }

  /**
   * Generate the request options
   * @param auth authentication information
   * @param path request path
   * @param method request method (POST, GET)
   */
  private static generateOptions(auth: any, path: string, method: string) {
    return {
      rejectUnauthorized: false,
      method: method,
      host: HOST,
      port: 443,
      path: path,
      headers: {
        'Content-Type': 'application/json',
        sign: auth.sign,
        key: auth.key,
      },
    };
  }

  /**
   * Execute an API query
   * @param auth authentication information
   * @param path request path
   * @param method request method (POST, GET)
   * @param callback function executed at completion of request
   */
  private execute(
    auth: any,
    path: string,
    method: string,
    callback: (error: any, data: string) => void
  ) {
    let options = CoinSpot.generateOptions(auth, path, method);
    let req = request(options, function(res) {
      let data = '';
      res.on('data', (chunk: string) => {
        data += chunk;
      });
      res.on('end', () => {
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

  /**
   * Get the balance of a coin in your account
   * @param coin id of the coin to check
   * @param callback function executed receiving the balance of the coin
   */
  balance(coin = 'btc', callback: (balance: number) => void) {
    let auth = this.authenticator.signature({});
    this.execute(auth, PATHS.BALANCES, POST, (e: string, res: string) => {
      if (e !== null) {
        console.error(e);
      } else {
        let data = JSON.parse(res);
        let balance = data.balance[coin];
        if (balance === undefined) {
          balance = 0;
        }
        callback(balance);
      }
    });
  }

  /**
   * Get the latest price of a coin
   * @param coin id of the coin to check
   * @param callback function
   */
  latest(coin = 'btc', callback: (data: any) => void) {
    let auth = this.authenticator.signature({});
    this.execute(auth, PATHS.LATEST, GET, (e: string, res: string) => {
      if (e !== null) {
        console.error(e);
      } else {
        let data = JSON.parse(res);
        callback(data[coin]);
      }
    });
  }

  /**
   * Get any open orders pertaining to a coin
   * @param coin id of the coin to check for orders
   * @param callback function
   */
  openOrders(coin = 'btc', callback: (data: any) => void) {
    let auth = this.authenticator.signature({
      cointype: coin,
    });
    this.execute(auth, PATHS.ORDERS, POST, (e: string, res: string) => {
      if (e !== null) {
        console.error(e);
      } else {
        let data = JSON.parse(res);
        callback(data[coin]);
      }
    });
  }
}
