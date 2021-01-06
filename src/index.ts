import { request } from 'https';
import { Authenticator } from './auth';

// Useful constants
const GET = 'GET';
const POST = 'POST';
const HOST = 'www.coinspot.com.au';

const PATHS = {
  LATEST: 'https://www.coinspot.com.au/pubapi/latest',
  BALANCES: '/api/my/balances',
  ORDERS: '/api/orders',
  ORDER_HISTORY: '/api/orders/history',
  QUICK_BUY: '/api/quote/buy',
  QUICK_SELL: '/api/quote/sell',
  MY_ORDERS: '/api/my/orders',
  PLACE_BUY: '/api/my/buy',
  PLACE_SELL: '/api/my/sell',
  CANCEL_BUY: '/api/my/buy/cancel',
  CANCEL_SELL: '/api/my/sell/cancel',
  DEPOSIT_COINS: '/api/my/coin/deposit',
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
        callback(data.prices[coin]);
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
        callback(data);
      }
    });
  }

  /**
   * Get the order history pertaining to a coin
   * @param coin id of the coin to check order history
   * @param callback function
   */
  orderHistory(coin = 'btc', callback: (data: any) => void) {
    let auth = this.authenticator.signature({
      cointype: coin,
    });
    this.execute(auth, PATHS.ORDER_HISTORY, POST, (e: string, res: string) => {
      if (e !== null) {
        console.error(e);
      } else {
        let data = JSON.parse(res);
        callback(data[coin]);
      }
    });
  }

  /**
   * Get the deposit information for a coin
   * @param coin id of the coin to deposit
   * @param callback function
   */
  depositCoins(coin = 'btc', callback: (data: any) => void) {
    let auth = this.authenticator.signature({
      cointype: coin,
    });
    this.execute(auth, PATHS.DEPOSIT_COINS, POST, (e: string, res: string) => {
      if (e !== null) {
        console.error(e);
      } else {
        let data = JSON.parse(res);
        callback(data);
      }
    });
  }

  /**
   * List a quick buy order
   * @param coin id of the coin to buy
   * @param amount amount of the coin to buy
   * @param callback function
   */
  quickBuy(coin = 'btc', amount: number, callback: (data: any) => void) {
    let auth = this.authenticator.signature({
      cointype: coin,
      amount: amount,
    });
    this.execute(auth, PATHS.QUICK_BUY, POST, (e: string, res: string) => {
      if (e !== null) {
        console.error(e);
      } else {
        let data = JSON.parse(res);
        callback(data);
      }
    });
  }

  /**
   * List a quick sell order
   * @param coin id of the coin to sell
   * @param amount amount of the coin to sell
   * @param callback function
   */
  quickSell(coin = 'btc', amount: number, callback: (data: any) => void) {
    let auth = this.authenticator.signature({
      cointype: coin,
      amount: amount,
    });
    this.execute(auth, PATHS.QUICK_SELL, POST, (e: string, res: string) => {
      if (e !== null) {
        console.error(e);
      } else {
        let data = JSON.parse(res);
        callback(data);
      }
    });
  }

  /**
   * Get all buy & sell orders of CoinSpot account
   * @param callback function
   */
  myOrders(callback: (data: any) => void) {
    let auth = this.authenticator.signature({});
    this.execute(auth, PATHS.MY_ORDERS, POST, (e: string, res: string) => {
      if (e !== null) {
        console.error(e);
      } else {
        let data = JSON.parse(res);
        callback(data);
      }
    });
  }

  /**
   * Place a buy order for a coin at a specific rate
   * @param coin id of the coin to buy
   * @param amount amount of the coin to buy
   * @param rate desired AUD rate of the coin to buy
   * @param callback function
   */
  placeBuy(
    coin = 'btc',
    amount: number,
    rate: number,
    callback: (data: any) => void
  ) {
    let auth = this.authenticator.signature({
      cointype: coin,
      amount: amount,
      rate: rate,
    });
    this.execute(auth, PATHS.PLACE_BUY, POST, (e: string, res: string) => {
      if (e !== null) {
        console.error(e);
      } else {
        let data = JSON.parse(res);
        callback(data);
      }
    });
  }

  /**
   * Place a sell order for a coin at a specific rate
   * @param coin id of the coin to sell
   * @param amount amount of the coin to sell
   * @param rate desired AUD rate of the coin to sell
   * @param callback callback
   */
  placeSell(
    coin = 'btc',
    amount: number,
    rate: number,
    callback: (data: any) => void
  ) {
    let auth = this.authenticator.signature({
      cointype: coin,
      amount: amount,
      rate: rate,
    });
    this.execute(auth, PATHS.PLACE_SELL, POST, (e: string, res: string) => {
      if (e !== null) {
        console.error(e);
      } else {
        let data = JSON.parse(res);
        callback(data);
      }
    });
  }

  /**
   * Cancel a buy order
   * @param id buy order to cancel
   * @param callback function
   */
  cancelBuy(id: any, callback: (data: any) => void) {
    let auth = this.authenticator.signature({
      id: id,
    });
    this.execute(auth, PATHS.CANCEL_BUY, POST, (e: string, res: string) => {
      if (e !== null) {
        console.error(e);
      } else {
        let data = JSON.parse(res);
        callback(data);
      }
    });
  }

  /**
   * Cancel a sell order
   * @param id sell order to cancel
   * @param callback function
   */
  cancelSell(id: any, callback: (data: any) => void) {
    let auth = this.authenticator.signature({
      id: id,
    });
    this.execute(auth, PATHS.CANCEL_SELL, POST, (e: string, res: string) => {
      if (e !== null) {
        console.error(e);
      } else {
        let data = JSON.parse(res);
        callback(data);
      }
    });
  }
}
