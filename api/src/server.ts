import express from 'express';
import { placeOrder } from './browser-actions';
import { config } from './config';
import { Status } from './typings/http';
import { logger } from './utils/logger';
import { Scraper } from './utils/scraper';

const app = express();

/* Config */
app.use(
  (
    req: { method: string; ip: unknown; url: unknown },
    res: { header: (arg0: string, arg1: string) => void; sendStatus: (arg0: number) => void },
    next: () => void,
  ) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      logger.info(`${req.ip} ${req.method} ${req.url}`);
      next();
    }
  },
);

app.use(express.json());

/* Endpoints */
app.get('/', async (req, res) => {
  res.send(JSON.stringify(new Date().toLocaleString()));
});

app.get('/getItem', async (req, res) => {
  const html = await Scraper.fetch();
  const menu = await Scraper.getMenu(html);
  const randomItem = await Scraper.getRandomMenuItem(menu);
  res.send(JSON.stringify(randomItem));
});

app.get('/placeOrder', async (req, res) => {
  const item = req.query.itemName;
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions,no-unused-expressions
  !item
    ? res.send({ status: 'Error', message: 'Item name was not provided.' } as Status)
    : await (async (): Promise<void> => {
        const status = await placeOrder(item as string);
        res.send(status);
      })();
});

app.listen(config.SERVER_PORT, config.SERVER_HOST, () =>
  logger.info(`Server now listening on ${config.SERVER_HOST}:${config.SERVER_PORT}.`),
);
