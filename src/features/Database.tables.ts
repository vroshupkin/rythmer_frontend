import { SleepRoutine } from '../entities/Database';
import { CommonNoteCrud, CreateCommonNoteStore } from '../features/CommonNote.table';
import { CreateStoreSleep } from './SleepRoutine.table';


const open_db = (db_name: string, db_version: number) => 
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

export const databaseCommonNoteCrud = new CommonNoteCrud('commonNote', 'create_at', db);
export const databaseSleepRoutine = new SleepRoutine('sleepRoutine', 'date', db);


