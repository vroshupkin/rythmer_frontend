
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

      if(!db.objectStoreNames.contains(db_name))
      {
        const sleepRoutine = db.createObjectStore(db_name, { keyPath: 'id', autoIncrement: true });
        sleepRoutine.createIndex('date', 'date', { unique: true });
        sleepRoutine.createIndex('wake_up', 'wake_up');
        sleepRoutine.createIndex('faling_sleep', 'faling_sleep');
      }

      resolve(db);
    };

  });
};

export class Database 
{
  private store_name = 'sleepRoutine';
  
  constructor(private db: IDBDatabase) 
  {}

  private get objectStore()
  {
    return this.db.transaction([ this.store_name ], 'readwrite').objectStore(this.store_name);
  }

  addSleepTime(dto: {date: Date, wake_up: string, faling_sleep: string})
  {
    return new Promise((resolve, reject) => 
    {
      this.objectStore.put(dto);
      const request = this.objectStore.put(dto);
      request.onsuccess = resolve;
      request.onerror = reject;
    });
    
  }

  updateSleepTime(date: Date, faling_sleep: string)
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
  }

  updateWakeUp(date: Date, wake_up: string)
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
  }

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


