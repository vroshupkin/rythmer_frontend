

export type TOneTable<
  StoreName extends string,
  Data extends Record<string, any>,
  Index extends keyof Data
 > = {
  store_name: StoreName,
  data: Data,
  index_key: Index
}


type TSleepRoutine = TOneTable<'sleepRoutine', {date: Date, wake_up: string, faling_sleep: string}, 'date'>


export class OneTableCrud
<
  StoreName extends string,
  TData extends Record<string, any>,
  IndexKey extends keyof TData
>
{
  constructor(public storeName: StoreName, public index_key: IndexKey, public db: IDBDatabase)
  { }
  

  get store()
  {
    return this.db.transaction([ this.storeName ], 'readwrite').objectStore(this.storeName);
  }

  getAll()
  {
    return new Promise<TData[] | undefined>((resolve, reject) => 
    {
      const req = this.store.getAll();
      
      req.onsuccess = () => resolve(req.result);
      req.onerror = reject;
    }
    );
  }

  get(index_val: TData[IndexKey])
  {
    return new Promise<TData | undefined>((resolve, reject) => 
    {
      const req = this.store.index(this.index_key as string).get(index_val);
      
      req.onsuccess = () => resolve(req.result);
      req.onerror = reject;
    }
    );
  }

  put(index_val: TData[IndexKey], input: Partial<Omit<TData, IndexKey>>)
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
          res = Object.assign(input, { [this.index_key]: index_val }) as TData;
        }

        const req = this.store.put(res);
        req.onsuccess = resolve;
        req.onerror = reject;
      });
      
    });
  }
}


export class SleepRoutine extends OneTableCrud<
  TSleepRoutine['store_name'],
  TSleepRoutine['data'],
  TSleepRoutine['index_key']
> 
{}

export class CreateStore<TStore extends Record<string, string | number>>
{
  
  createIndex(store: IDBObjectStore, key: keyof TStore, options?: IDBIndexParameters)
  {
    store.createIndex(key as string, key as string,  options);
  }

}

