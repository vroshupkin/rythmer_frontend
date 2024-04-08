

type TOneTable<
  StoreName extends string,
  Data extends Record<string, any>,
  Index extends keyof Data
 > = {
  store_name: StoreName,
  data: Data,
  index_key: Index
}


type TCommonNote  = TOneTable<'commonNote', {date: string, message: string}, 'date'>
type TSleepRoutine = TOneTable<'sleepRoutine', {date: Date, wake_up: string, faling_sleep: string}, 'date'>


export class OneTableCrud
<
  StoreName extends string,
  TableData extends Record<string, any>,
  IndexKey extends keyof TableData
>
{
  constructor(public storeName: StoreName, public index_key: IndexKey, public db: IDBDatabase)
  { }
  

  get store()
  {
    return this.db.transaction([ this.storeName ], 'readwrite').objectStore(this.storeName);
  }

  get(index_val: TableData[IndexKey])
  {
    return new Promise<TableData | undefined>((resolve, reject) => 
    {
      const req = this.store.index(this.index_key as string).get(index_val);
      
      req.onsuccess = () => resolve(req.result);
      req.onerror = reject;
    }
    );
  }

  put(index_val: TableData[IndexKey], input: Partial<Omit<TableData, IndexKey>>)
  {
    return new Promise((resolve, reject) =>
    {
      this.get(index_val).then(res => 
      {
        if(res)
        {
          Object.assign(res, input);
        }
        else
        {
          res = Object.assign(input, { [this.index_key]: index_val }) as TableData;
        }

        this.store.put(res);

        resolve(true);

      }).catch(reject);
      
    });

  }
}

export class CommonNoteCrud extends OneTableCrud<TCommonNote['store_name'], TCommonNote['data'], TCommonNote['index_key']>
{}
export class SleepRoutine extends OneTableCrud<TSleepRoutine['store_name'], TSleepRoutine['data'], TSleepRoutine['index_key']> 
{}

// export const commonNoteCrud = new OneTableCrud<TCommonNoteData, TCommonNoteIndexKey>('commonNote', db, 'date')


export class CreateStoreSleep
{
  constructor(db: IDBDatabase)
  {
    if(!db.objectStoreNames.contains('sleepRoutine'))
    {
      const store = db.createObjectStore('sleepRoutine', { keyPath: 'id', autoIncrement: true });
      store.createIndex('date', 'date', { unique: true });
      store.createIndex('wake_up', 'wake_up');
      store.createIndex('faling_sleep', 'faling_sleep');
    }
  }
}

export class CreateCommonNoteStore 
{
  constructor(private db: IDBDatabase)
  {
    if(!this.db.objectStoreNames.contains('commonNote'))
    {
      const store = this.db.createObjectStore('commonNote', { keyPath: 'id', autoIncrement: true });
      store.createIndex('date', 'date', { unique: true });
      store.createIndex('message', 'message');
    }
  }
}


export const open_db = (db_name: string, db_version: number) => 
{
  return new Promise<IDBDatabase>((resolve, reject) => 
  {
    const request = window.indexedDB.open(db_name, db_version);
    
    request.onerror = reject;
    request.onsuccess = (event) => 
    {
      const db = (event.target as IDBOpenDBRequest).result;

      db.onversionchange = () => 
      {
        db.close();
        alert('База данных устарела, пожалуйста, перезагрузите страницу.');
      };

      resolve(db);
    };

    request.onupgradeneeded = (event) => 
    {
      const db = (event.target as IDBOpenDBRequest).result;

      new CreateCommonNoteStore(db);
      new CreateStoreSleep(db);

      resolve(db);
    };

  });
};


const db = await open_db('App', 3);
// export const crud = new Database(db);
export const databaseStores = {
  commonNote: new CommonNoteCrud('commonNote', 'date', db),
  sleepRoutine: new SleepRoutine('sleepRoutine', 'date', db)
};

