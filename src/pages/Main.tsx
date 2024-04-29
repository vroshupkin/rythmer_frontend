import { FC, useState } from 'react';
// import { hooks } from '../entities/Date.slice';


import { useSignals } from '@preact/signals-react/runtime';
import { databaseSleepRoutine } from '../features/Database.tables';
import { LeftMenu } from '../widgets/LeftMenu';
import { WakeUpOrSleep } from '../widgets/WakeUpAndSleepTime';
import { Calendar } from '../widgets/calendar/Calendar';
import { CreateNoteButton } from '../widgets/notes/CreateNoteButton.ui';
import { NoteSelector, TSelectType } from '../widgets/notes/NoteSelector';
import { Notes } from '../widgets/notes/Notes';
import { signalSelectDate } from './Main.signals';


export const Main: FC  = () => 
{

  console.log('CI/CD work');
  
  const [ noteType, setNoteType ] = useState<TSelectType>('common');
  const onChangeNoteType = (type: TSelectType) => setNoteType(type);
  
  useSignals();
  
  return(
    <div className='flex items-start'>
      <LeftMenu/>
      <div className='flex flex-col justify-center items-center w-[100%]'>
        <Calendar/>
        <div className='w-[320px] mt-[18px] flex flex-space justify-between'>
          <WakeUpOrSleep 
            updateVal={databaseSleepRoutine}
            findDate={signalSelectDate.value}
            getType='wake_up'
          />
          <WakeUpOrSleep 
            updateVal={databaseSleepRoutine}
            findDate={signalSelectDate.value}
            getType='faling_sleep'
          />
        </div>
          
        <NoteSelector className='mt-[15px]'
          onChangeNoteType={onChangeNoteType}
        />
          
        <CreateNoteButton className='flex justify-center w-[422px] mt-[21px]'
          type={noteType}
          selectDate={signalSelectDate.value}/>
        <Notes find_date={signalSelectDate.value}/>
          
      </div>

      
    </div>
  );
};
