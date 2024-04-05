import { FC, useState } from 'react';
import { Provider } from 'react-redux';
import { hooks } from '../entities/Date.slice';
import { date_store } from '../entities/Date.store';
import { Calendar } from '../widgets/Calendar';
import { LeftMenu } from '../widgets/LeftMenu';
import { WakeUpOrSleep } from '../widgets/WakeUpAndSleepTime';
import { crud, databaseStores } from '../entities/Database';
import { NoteSelector } from '../widgets/NoteSelector';


export const Main: FC  = () => 
{
  

  databaseStores.commonNote.put({ date: '05.04.24', message: 'Другая заметка' })
    .then(() => 
    {
      databaseStores.commonNote.get({ date: '05.04.24' }).then(console.log);  
    });

  // databaseStores.commonNote.get({ date: '05.04.24' }).then(res => 
  // {
  //   console.log(res);
    
  // });
    
  return(
    <div className='flex items-start'>
      <LeftMenu/>

      <Provider store={date_store}>
        <div className='flex flex-col justify-center items-center w-[100%]'>
          <Calendar/>
          <div className='w-[320px] mt-[18px] flex flex-space justify-between'>
            <WakeUpOrSleep className='' updateVal={crud.updateWakeUp} getType='wake_up'/>
            <WakeUpOrSleep className='' updateVal={crud.updateSleepTime} getType='faling_sleep'/>
          </div>
          
          <NoteSelector className='mt-[15px]'/>
          {/* <SleepAndWakeUp/> */}
        </div>
        

      </Provider>
      
    </div>
  );
};


const SleepAndWakeUp: FC = () => 
{
  const [ falingSleep, setFalingSleep ] = useState('');
  const [ wakeUp, setWakeUp ] = useState('');

  const date_str = hooks.selector.useDate();
  const date = new Date(date_str);

  const save = async () => 
  {
    await crud.updateSleepTime(date, falingSleep);
    await crud.updateWakeUp(date, wakeUp); 
  };
  
  const Styles = {
    input: 'border-[1px] w-[200px] hover:bg-main_hover',
    button: 'border-[1px] w-[200px] bg-main hover:bg-main_hover ml-[100px]',
    span: 'w-[100px] inline-block text-center'
  };
  
  const getDateMonthYear = (date: Date) => `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;

  return(
    <div className='flex flex-col'>
      <div>
        <span className={Styles.span}>{getDateMonthYear(date)}</span>
        
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