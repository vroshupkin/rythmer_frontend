import { FC, useEffect, useState } from 'react';

import { useSignalEffect, useSignals } from '@preact/signals-react/runtime';
import { signalCacheCommonNoteUpdate } from '../../entities/Cache.signal';
import { TStoreCommonNote } from '../../features/CommonNote.table';
import { DateWithDayPrecision } from '../../shared/DateTools';
import { useCacheSignal } from '../../shared/useCacheSignal';
import { signalSelectDate } from '../../pages/Main.signals';
import { CommonNote } from './CommonNote';


type TPropsNotes = {
    find_date: string | Date
}

export const Notes: FC<TPropsNotes> = ({ find_date }) => 
{
  const [ notes, setNotes ] = useState([] as TStoreCommonNote[]); 
  const signalData = useCacheSignal<TStoreCommonNote[]>(signalCacheCommonNoteUpdate);
  
  const handler = () => 
  {
    const date_str = new DateWithDayPrecision(find_date) + '';
    
    // @ts-ignore
    setNotes(signalData.filter(obj => obj.day_of_month === date_str));
    
  };
  
  useEffect(() => 
  {    
    
    handler();
    
  }, [ signalData, find_date ]);

  const [ selectDate, setSelectDate ] = useState(new Date(0)); 

  useSignalEffect(() => 
  {
    if(selectDate != signalSelectDate.value)
    {
      handler();
      setSelectDate( new Date(signalSelectDate.value));
    }
  });


  useSignals();
  
  return(
    <>
      {
        notes.map(({ create_at, message, day_of_month }, i) => 
          <div className='mt-[10px]' key={i}>
            <CommonNote create_at={create_at} message={message} day_of_month={day_of_month} />
          </div>
          
        )
      }
    </>
        
        
  );
};
