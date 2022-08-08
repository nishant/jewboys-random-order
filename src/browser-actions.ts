/* Methods */
import { click, closeBrowser, goto, openBrowser, press, write } from 'taiko';
import { Status } from './typings/http';
import { logger } from './utils/logger';

export const placeOrder = async (itemName: string): Promise<Status> => {
  logger.info(itemName);

  try {
    await openBrowser({ headless: false });
    await goto('jewboysubshop.com');
    await click('Order Online');
    await click('Start Order');
    await click(itemName);
    await click('Add to Cart');
    await click('Checkout');
    await write('Nishant');
    await press('Tab');
    await write('Arora');
    await press('Tab');
    await write('nish54@gmail.com');
    await press('Tab');
    await write('9088643800');
    await press('Tab');
    await press('Tab');
    await write('0000000000000000');
    await press('Tab');
    await write('02/25');
    await press('Tab');
    await write('000');
    await press('Tab');
    await write('78756');
    await press('Tab');
    await click('20%');
    return { status: 'Success', message: 'Order Placed' };
  } catch (error) {
    logger.error(error);
    return { status: 'Error', message: (error as Error).message };
  } finally {
    await closeBrowser();
  }
};
