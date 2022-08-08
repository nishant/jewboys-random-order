import axios from 'axios';
import cheerio from 'cheerio';
import { DomIds } from '../typings/dom-ids';
import { Category, MenuItem } from '../typings/menu';
import { logger } from './logger';

export class Scraper {
  private static readonly SUBSHOP_URL = 'http://jewboysubshop.com/menu/';

  private static client = axios.create();

  public static async fetch(): Promise<string> {
    logger.info('Scraper running!');
    return this.getHtml();
  }

  public static getMenu(html: string): Map<Category, Array<MenuItem>> {
    const DOM = cheerio.load(html);
    const getText = (dom: any, context: string): string => DOM(dom).find(context).first().text();

    const menu = new Map<Category, Array<MenuItem>>();

    let menuSections: any[] = [];

    const getMenuSections = (): void => {
      DOM(DomIds.SITE_CONTENT)
        .find(DomIds.MENU_SECTIONS)
        .each((idx, element) => {
          menuSections.push(DOM(element));
        });
      menuSections = menuSections.filter((section) => (section.html() ?? '').trim().length > 0);
    };

    const getMenuItems = (): void => {
      menuSections.forEach((section, idx) => {
        let category = getText(section, 'h3');
        const items: Array<MenuItem> = [];

        if (idx === 2) category = 'Cold Subs';
        if (idx === 3) category = 'Sides';
        if (idx === 5) category = 'Brunch Plates';
        if (idx === 6) category = 'Breakfast Sandwiches';

        DOM(section)
          .find(DomIds.FOOD_ITEM)
          .each((_, element) => {
            const name = getText(DOM(element), 'h4');
            const description = getText(DOM(element), 'p');
            items.push({ name, description });
          });
        menu.set(category, items);
      });
    };

    getMenuSections();
    getMenuItems();

    return menu;
  }

  public static getRandomMenuItem(menu: Map<Category, Array<MenuItem>>): MenuItem {
    const getRandomItem = (iterable: Map<unknown, unknown>): unknown =>
      iterable.get([...iterable.keys()][Math.floor(Math.random() * iterable.size)]);

    const randomSubmenu = getRandomItem(menu) as Array<MenuItem>;

    return randomSubmenu[Math.floor(Math.random() * randomSubmenu.length)];
  }

  private static async getHtml(): Promise<string> {
    try {
      logger.info(`Scraping HTML from '${this.SUBSHOP_URL}'...`);
      const { data } = await this.client.get(`${this.SUBSHOP_URL}`);
      return data;
    } catch (e: unknown) {
      logger.error(e);
      throw new Error('Error making GET request.');
    }
  }
}
