# coinspotapi

This package provides an updated and easy-to-use way of interacting with the [CoinSpot](https://www.coinspot.com.au/) API.

Setup and installation is simple, all you need is your API key and secret from CoinSpot.

[![GitHub issues](https://img.shields.io/github/issues/henry-burgess/coinspotapi)](https://github.com/henry-burgess/coinspotapi/issues)
[![GitHub stars](https://img.shields.io/github/stars/henry-burgess/coinspotapi)](https://github.com/henry-burgess/coinspotapi/stargazers)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/henry-burgess/coinspotapi/CI)

## Installation

*coinspotapi* requires Node.js to be installed on your system.

Once Node.js is installed, run:

```bash
npm i @henryburgess/coinspotapi
```

## Example usage

To use *coinspotapi* in your project, all you need to get started is a few lines of code:

```javascript
// index.js
const { CoinSpot } = require('coinspotapi');
const client = new CoinSpot('key', 'secret');
```

Ensure to replace `'key'` and `'secret'` with your own CoinSpot API key and secret. **Warning!** Keep wary of publishing this file publically, or at least take precautions to exclude any files which contain at least your secret key.

## Supported requests

The complete API documentation for CoinSpot can be found [here](https://www.coinspot.com.au/api). At this stage, most requests are currently supported, but I plan to finish the remaining requests soon, as well as add a few extra ones that make life easier.

* `balance(coin, callback(balance))`: Get the balance of a coin in your account
* `latest(coin, callback(data))`: Get the pricing data of a coin
* `openOrders(coin, callback(data))`: Get any open orders pertaining to a coin
* `orderHistory(coin, callback(data))`: Get the order history pertaining to a coin
* `depositCoins(coin, callback(data))`: Get the deposit information for a coin, e.g. your Bitcoin address
* `quickBuy(coin, amount, callback(data))`: List a quick buy order
* `quickSell(coin, amount, callback(data))`: List a quick sell order
* `myOrders(callback(data))`: Get all buy & sell orders in your account
* `placeBuy(coin, amount, rate, callback(data))`: Place a buy order for a coin at a specific rate
* `placeCell(coin, amount, rate, callback(data))`: Place a sell order for a coin at a specific rate
* `cancelBuy(id, callback(data))`: Cancel an active buy order
* `cancelSell(id, callback(data))`: Cancel an active sell order