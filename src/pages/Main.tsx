import { FC, useState } from 'react';
import { Provider } from 'react-redux';
import { Database } from '../entities/Database';
import { hooks } from '../entities/Date.slice';
import { date_store } from '../entities/Date.store';
import { Calendar } from '../widgets/Calendar';
import { LeftMenu } from '../widgets/LeftMenu';


const db = new Database('App', 2);
await db.open();
// await db.addUser('hello', 'user@gmail.com');
await db.addSleepTime({ date: new Date('04.31.24'), wake_up: '10:10', faling_sleep: '2:40' });


export const Main: FC  = () => 
{
  
  return(
    <div className='flex items-start'>
      <LeftMenu/>

      <Provider store={date_store}>
        <div className='flex flex-col w-[100%]'>

        
          <Calendar/>
          <SleepAndWakeUp/>
        </div>
        
      </Provider>
      
    </div>
  );
};


const SleepAndWakeUp: FC = () => 
{
  const [ falingSleep, setFalingSleep ] = useState('');
  const [ wakeUp, setWakeUp ] = useState('');

  const date = hooks.selector.useDate();
  const save = async () => 
  {
    const search_row = await db.getSleepWakeupTime(date);
    console.log(search_row);
    
    if(!search_row)
    {
      db.addSleepTime({ date: new Date(date), faling_sleep: falingSleep, wake_up: wakeUp });
    }
    else
    {
      await db.updateSleepTime(date, falingSleep);
      
    }
    
  };
  
  const Styles = {
    input: 'border-[1px] w-[200px] hover:bg-main_hover',
    button: 'border-[1px] w-[200px] bg-main hover:bg-main_hover ml-[100px]',
    span: 'w-[100px] inline-block text-center'
  };
  
  return(
    <div className='flex flex-col'>
      <div>
        <span className={Styles.span}>{`${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`}</span>
        
      </div>
      
      <div>
        <span className={Styles.span}>Faling Sleep </span>
        <input className={Styles.input} type="text" onChange={(e) => setFalingSleep(e.target.value)}/>
      </div>
      <div>
        <span className={Styles.span}>Wake up</span>
        <input className={Styles.input} type="text" onChange={(e) => setWakeUp(e.target.value)}/>
      </div>
      
      <button className={Styles.button} onClick={save}>Save</button>

    </div>
  );
};