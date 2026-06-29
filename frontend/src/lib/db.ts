import Dexie, { Table } from 'dexie';

export interface LocalProduct {
  id: string; sku: string; name: string; price: number; stock: number;
}
export interface LocalInvoice {
  id: string; number: string; total: number; lines: any[]; syncStatus: 'PENDING' | 'SYNCED';
}

export class TechProDB extends Dexie {
  products!: Table<LocalProduct, string>;
  invoices!: Table<LocalInvoice, string>;
  syncQueue!: Table<{ id: string, type: string, payload: any }, string>;

  constructor() {
    super('TechProDB');
    this.version(1).stores({
      products: 'id, sku, name',
      invoices: 'id, number, syncStatus',
      syncQueue: 'id, type'
    });
  }
}

export const db = new TechProDB();
