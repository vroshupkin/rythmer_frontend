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
  putWithStore(key: TIndexVal, input: Omit<TStoreCommonNote, TKeyIndex>)
  {
    this.put(key, input);
  }
  
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


