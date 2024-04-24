import { Signal, signal } from '@preact/signals-react';
import { CreateStore, OneTableCrud } from '../entities/Database';


export type TStoreCommonNote = 
{
  create_at: string,    
  day_of_month: string,
  message: string
}

type TStoreName = 'commonNote'
type TKeyIndex = 'create_at'     // primary key
type TIndexVal = TStoreCommonNote[TKeyIndex];


export class CommonNoteCrud 
  extends OneTableCrud<TStoreName, TStoreCommonNote, TKeyIndex>
{
  
  // Кешированные данные
  private _data = { data: [] as TStoreCommonNote[], lastUpdate: new Date() };

  constructor(storeName: TStoreName, index_key: TKeyIndex, db: IDBDatabase, 
    private cacheSignal: Signal<{lastUpdate: Date, data: any[]}>)
  { 
    super(storeName, index_key, db);

    this.getAll().then(data => 
    {
      data = data ?? [];
      this._data = { data, lastUpdate: new Date() };
    });
  }

  public get data()
  {
    return Object.assign(this._data, {});
  }

  async getByDate(find_date: string)
  {
    const res = await this.getAll();
    if(!res) 
    {
      return [];
    }
    
    return res.filter(val => val.day_of_month === find_date);
  }

  
  // TODO Сделать обощенный сигнал на обновления 
  putWithSignal = async (key: TIndexVal, input: Partial<Omit<TStoreCommonNote, TKeyIndex>>) =>
  {
    await this.put(key, input);
    const data = await this.getAll();
    // @ts-ignore
    this.cacheSignal.value = { lastUpdate: new Date(), data };
    
  };
  
  
}


export class CreateCommonNoteStore extends CreateStore<TStoreCommonNote>
{
  constructor(private db: IDBDatabase)
  {
    super();
    if(!this.db.objectStoreNames.contains('commonNote'))
    {
      const store = this.db.createObjectStore('commonNote', { keyPath: 'id', autoIncrement: true });
      
      this.createIndex(store, 'create_at', { unique: true });
      this.createIndex(store, 'day_of_month');
      this.createIndex(store, 'message'); 
    }
  }
}


