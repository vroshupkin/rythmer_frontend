import { FC, useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { hooks } from '../entities/Date.slice';
import { date_store } from '../entities/Date.store';


import { useSignals } from '@preact/signals-react/runtime';
import { databaseSleepRoutine } from '../features/Database.tables';
import { LeftMenu } from '../widgets/LeftMenu';
import { WakeUpOrSleep } from '../widgets/WakeUpAndSleepTime';
import { Calendar } from '../widgets/calendar/Calendar';
import { signalSelectDate } from './Main.signals';
import { NoteSelector, TSelectType } from '../widgets/notes/NoteSelector';
import { Notes } from '../widgets/notes/Notes';
import { CreateNoteButton } from '../widgets/notes/CreateNoteButton.ui';


export const Main: FC  = () => 
{
  useSignals();
  
  const [ noteType, setNoteType ] = useState<TSelectType>('common');
  const onChangeNoteType = (type: TSelectType) => setNoteType(type);
  
  
  return(
    <Provider store={date_store}>
      <div className='flex items-start'>
        <LeftMenu/>
        <div className='flex flex-col justify-center items-center w-[100%]'>
          <Calendar/>
          <div className='w-[320px] mt-[18px] flex flex-space justify-between'>
            <WakeUpOrSleep className='' updateVal={databaseSleepRoutine} getType='wake_up'/>
            <WakeUpOrSleep className='' updateVal={databaseSleepRoutine} getType='faling_sleep'/>
          </div>
          
          <NoteSelector className='mt-[15px]'
            onChangeNoteType={onChangeNoteType}
          />
          
          <CreateNoteButton className='flex justify-center w-[422px] mt-[21px]'
            type={noteType}
            selectDate={signalSelectDate.value}/>
          <Notes find_date={signalSelectDate.value}/>
          
          {/* <SleepAndWakeUp/> */}
        </div>

      
      </div>
    </Provider>
  );
};


const SleepAndWakeUp: FC = () => 
{
  const [ faling_sleep, setFalingSleep ] = useState('');
  const [ wake_up, setWakeUp ] = useState('');

  const date_str = hooks.selector.useDate();
  const date = new Date(date_str);

  const save = async () => 
  {
    databaseSleepRoutine.put(date, { faling_sleep, wake_up });
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