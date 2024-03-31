
export class Database 
{
  private db?: IDBDatabase; 
  private store_name = 'sleepRoutine';
  
  constructor(private dbName: string, private dbVersion: number) 
  {
    // const transaction = this.db.transaction([ 'people' ], 'readwrite');
    // const objectStore = transaction.objectStore('people');
    
  }

  public open(): Promise<void> 
  {
    return new Promise<void>((resolve, reject) => 
    {
      const request = window.indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => 
      {
        reject('Database error: ' + (event.target as IDBOpenDBRequest));
      };

      request.onsuccess = (event) => 
      {
        const db = (event.target as IDBOpenDBRequest).result;
        console.log('Database opened successfully');

        db.onversionchange = () => 
        {
          db.close();
          alert('База данных устарела, пожалуйста, перезагрузите страницу.');
        };

        this.db = db;
        resolve();
      };

      request.onupgradeneeded = (event) => 
      {
        const db = (event.target as IDBOpenDBRequest).result;

        if(!db.objectStoreNames.contains(this.store_name))
        {
          const sleepRoutine = db.createObjectStore(this.store_name, { keyPath: 'id', autoIncrement: true });
          sleepRoutine.createIndex('date', 'date', { unique: true });
          sleepRoutine.createIndex('wake_up', 'wake_up');
          sleepRoutine.createIndex('faling_sleep', 'faling_sleep');
        }

        resolve();
        
        
      };

    });
  }

  async addUser(name: string, email: string)
  {
    
    if(!this.db)
    {
      throw Error('db must be opened!');
    }
      
    const transaction = this.db.transaction([ 'people' ], 'readwrite');
    const objectStore = transaction.objectStore('people');
    
    
    const request = objectStore.add({ name: name, email: email });
      
    request.onsuccess = (event) => 
    {
      console.log('Added new user!');
      
      return;
    };

    request.onerror = (event) => 
    {
      // @ts-ignore
      throw new Error(event.target.error);
    };
  }


  private async add<T extends Record<string, string | number | Date>>(store: string, dto: T)
  {
    if(!this.db)
    {
      throw Error('db must be opened!');
    }

    
    const transaction = this.db.transaction([ store ], 'readwrite');
    const objectStore = transaction.objectStore(store);
    
    const request = objectStore.put({ ...dto });

    
    request.onsuccess = (event) => 
    {
      return;
    };

    request.onerror = (event) => 
    {
      // @ts-ignore
      throw new Error(event.target.error);
    };

  }

  async addSleepTime(dto: {date: Date, wake_up: string, faling_sleep: string})
  {
    this.add('sleepRoutine', dto);
  }

  updateSleepTime(date: Date, faling_sleep: string)
  {
    return new Promise((resolve, reject) => 
    {
      
      this.getSleepWakeupTime(date).then((result) => 
      {
        if(!this.db)
        {
          throw Error('db must be opened!');
        }

        const transaction = this.db.transaction([ this.store_name ], 'readwrite');
          
        let request;
        if(result)
        {
          result.faling_sleep = faling_sleep;
          request = transaction.objectStore(this.store_name).put(result);
        }
        else
        {
          request = transaction.objectStore(this.store_name).add({ date, faling_sleep, wake_up: '' });
        }

        request.onsuccess = resolve;
        request.onerror = reject;

      });


    });
  }

  getSleepWakeupTime(date: Date): Promise<any>
  {
    return new Promise((resolve, reject) => 
    {

      if(!this.db)
      {
        throw Error('db must be opened!');
      }

      const transaction = this.db.transaction([ this.store_name ], 'readonly');
      const objectStore = transaction.objectStore(this.store_name);
    
      const request = objectStore.index('date').get(date);
    
      request.onsuccess = (e) => 
      { 
        resolve(request.result);
      };

      request.onerror = (e) => reject;

    }
    );
  }
}


