/***************************************************************************************************************************
 * @license                                                                                                                *
 * Copyright 2017 Coinbase, Inc.                                                                                           *
 *                                                                                                                         *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance          *
 * with the License. You may obtain a copy of the License at                                                               *
 *                                                                                                                         *
 * http://www.apache.org/licenses/LICENSE-2.0                                                                              *
 *                                                                                                                         *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on     *
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the                      *
 * License for the specific language governing permissions and limitations under the License.                              *
 ***************************************************************************************************************************/

import { ConsoleLoggerFactory } from '../utils/Logger';
import { printOrderbook, printTicker } from '../utils/printers';
import { FeedFactory } from '../factories/bitfinexFactories';
import { BitfinexFeed } from '../exchanges/bitfinex/BitfinexFeed';
import { LiveBookConfig, LiveOrderbook } from '../core/LiveOrderbook';
import { Ticker } from '../exchanges/PublicExchangeAPI';
import { TradeMessage } from '../core/Messages';

const product = 'BTC-USD';
const logger = ConsoleLoggerFactory();

FeedFactory(logger, ['BTC-USD']).then((feed: BitfinexFeed) => {
    const liveBookConfig: LiveBookConfig = {
        product: product,
        logger: logger
    };
    const book = new LiveOrderbook(liveBookConfig);
    book.on('LiveOrderbook.snapshot', () => {
        logger.log('info', 'Snapshot received');
        setInterval(() => {
            console.log(printOrderbook(book));
        }, 2000);
    });
    book.on('LiveOrderbook.ticker', (ticker: Ticker) => {
        console.log(printTicker(ticker));
    });
    book.on('LiveOrderbook.trade', (trade: TradeMessage) => {
        logger.log('info', `${trade.side} ${trade.size} on ${trade.productId} at ${trade.price}`);
    });
    book.on('end', () => {
        console.log('Orderbook closed');
    });
    feed.pipe(book);
});
