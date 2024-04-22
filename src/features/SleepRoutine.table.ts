import { CreateStore } from '../entities/Database';


export type TStoreSleepRoutine =
{
  date: string,
  wake_up: string,
  faling_sleep: string
}


export class CreateStoreSleep extends CreateStore<TStoreSleepRoutine>
{
  constructor(db: IDBDatabase)
  {
    super();
    if(!db.objectStoreNames.contains('sleepRoutine'))
    {
      const store = db.createObjectStore('sleepRoutine', { keyPath: 'id', autoIncrement: true });
      this.createIndex(store, 'date',  { unique: true });
      this.createIndex(store, 'wake_up',  { unique: true });
      this.createIndex(store, 'faling_sleep',  { unique: true });
    }
  }
}