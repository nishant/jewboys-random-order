export interface Menu {}

export type Category = string;

export interface MenuItem {
  itemType?: Category;
  name: string;
  description: string;
}
