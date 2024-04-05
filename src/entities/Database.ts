

export class Database 
{
  private store_name = 'sleepRoutine';
  
  constructor(private db: IDBDatabase) 
  {}

  private get objectStore()
  {
    return this.db.transaction([ this.store_name ], 'readwrite').objectStore(this.store_name);
  }

  updateSleepTime = (date: Date, faling_sleep: string) =>
  {
    return new Promise((resolve, reject) => 
    {
      
      this.getSleepWakeupTime(date).then((result) => 
      {
        
        if(result)
        {
          result.faling_sleep = faling_sleep;
        }
        else
        {
          result = { faling_sleep, date, wake_up: '' };
        }

        const request = this.objectStore.put(result);
        request.onsuccess = resolve;
        request.onerror = reject;

      });


    });
  };

  updateWakeUp = (date: Date, wake_up: string) =>
  {
    return new Promise((resolve, reject) => 
    {
      const get_result = async () => 
      {
        const result = await this.getSleepWakeupTime(date);
        if(result)
        {
          result.wake_up = wake_up; 
          
          return result;
        }
        
        return { date, wake_up, faling_sleep: '' }; 
      };
      
      get_result().then(result => 
      {
        const request = this.objectStore.put(result);
        request.onsuccess = resolve;
        request.onerror = reject;
      });


    });
  };

  getSleepWakeupTime(date: Date): Promise<any>
  {
    return new Promise((resolve, reject) => 
    {
      const transaction = this.db.transaction([ this.store_name ], 'readonly');
      const objectStore = transaction.objectStore(this.store_name);
    
      const request = objectStore.index('date').get(date);
    
      request.onsuccess = () => 
      { 
        resolve(request.result);
      };

      request.onerror = reject;

    }
    );
  }
}

abstract class AbstractCreateStore
{
  abstract createStore: () => void
}

type TCommonNote = {
  date: string,
  message: string
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

export class CommonNoteCrud
{
  private storeName = 'commonNote';

  constructor(private db: IDBDatabase)
  {
    
  }

  private get store()
  {
    return this.db.transaction([ this.storeName ], 'readwrite').objectStore(this.storeName);
  }

  get(input: {date: string})
  {
    return new Promise<TCommonNote>((resolve, reject) => 
    {
      const req = this.store.index('date').get(input.date);
      
      req.onsuccess = () => resolve(req.result);
      req.onerror = reject;
    }
    );
  }

  put(input: {date: string, message: string})
  {
    return new Promise((resolve, reject) =>
    {
      const { date, message } = input;
      
      const result = this.get({ date }).then(res => 
      {
        if(res)
        {
          res.message = message;
        }
        else
        {
          res = input;
        }

        this.store.put(res);

        resolve(result);

      }).catch(reject);
      
    });
  }
}

export class SleepRoutineCrud
{
  constructor(private db: IDBDatabase)
  {

  }
}

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


export const open_db = (db_name: string, db_version: number) => 
{
  return new Promise<IDBDatabase>((resolve, reject) => 
  {
    const request = window.indexedDB.open(db_name, db_version);

    request.onerror = (event) => 
    {
      reject('Database error: ' + (event.target as IDBOpenDBRequest));
    };

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
export const crud = new Database(db);
export const databaseStores = {
  commonNote: new CommonNoteCrud(db),
  sleepRoutine: new SleepRoutineCrud(db)
};

