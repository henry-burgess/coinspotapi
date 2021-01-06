# coinspotapi

[![GitHub issues](https://img.shields.io/github/issues/henry-burgess/coinspotapi)](https://github.com/henry-burgess/coinspotapi/issues)
[![GitHub stars](https://img.shields.io/github/stars/henry-burgess/coinspotapi)](https://github.com/henry-burgess/coinspotapi/stargazers)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/henry-burgess/coinspotapi/CI)

This package provides an updated and easy-to-use way of interacting with the [CoinSpot](https://www.coinspot.com.au/) API.

Setup and installation is simple, all you need is your API key and secret from CoinSpot.

## Installation

*coinspotapi* requires Node.js to be installed on your system.

Once installed, run:

```bash
> npm i coinspotapi
```

## Example usage

To use *coinspotapi* in your project, all you need to get started is a few lines of code:

```javascript
// index.js
const CoinSpot = require('coinspotapi');
const client = new CoinSpot('key', 'secret');
```

Ensure to replace `'key'` and `'secret'` with your own CoinSpot API key and secret. **Warning!** Keep wary of publishing this file publically, or at least take precautions to exclude any files which contain at least your secret key.

## Supported requests

The complete API documentation for CoinSpot can be found [here](https://www.coinspot.com.au/api). At this stage, only a few requests are currently supported, but I plan to finish the remaining requests soon, as well as add a few extra ones that make life easier.

### Balance

Allows you to check the balance of a specific asset in your portfolio. Will default to `0` if none is present. Balances are returned in AUD.

Method signature:
```typescript
CoinSpot.balance('coin ID', callback);
```

Example usage:
```typescript
CoinSpot.balance('eth', (res: number) => {
  console.log(res);
});
```

Example usage output:
```typescript
34.59
```

### Latest

Allows you to check the latest pricing data of any coin on CoinSpot. Returns an object containing the bid price, the asking price, and the last sold price.

Method signature:
```typescript
CoinSpot.latest('coin ID', callback);
```

Example usage:
```typescript
CoinSpot.latest('btc', (data: any) => {
  console.log(data);
});
```

Example usage output:
```typescript
{
  bid: '40000.00',
  ask: '43230.1234',
  last: '43210.1234',
}
```