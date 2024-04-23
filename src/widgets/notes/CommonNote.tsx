import { FC, useEffect, useRef, useState } from 'react';

import { FaFileAlt } from 'react-icons/fa';
import { signalCacheCommonNoteUpdate } from '../../entities/Cache.signal';
import { hooks } from '../../entities/Date.slice';
import { TStoreCommonNote } from '../../features/CommonNote.table';
import { databaseCommonNoteCrud } from '../../features/Database.tables';
import { DateWithDayPrecision, DateWithSecondPrecision } from '../../shared/DateTools';
import { useCacheSignal } from '../../shared/useCacheSignal';
import { useClickInside } from '../../shared/useClickInside.hook';
import { signalSelectDate } from '../calendar/Month.signals';
import { useSignalEffect, useSignals } from '@preact/signals-react/runtime';
import { effect } from '@preact/signals-react';


type TPropsCommonNote = Pick<TStoreCommonNote, 'create_at' | 'message' | 'day_of_month'>


const CommonNote: FC<TPropsCommonNote> = ({ create_at, message, day_of_month }) => 
{
  const ref = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
    
  const [ isEdit, setIsEdit ] = useState(false);
  const isOutsideClick = !useClickInside(ref);

  const [ text, setText ] = useState(message);

  useEffect(() => 
  {
    if(isEdit && textareaRef.current)
    {
      textareaRef.current.value = text;
      textareaRef.current.focus();
    }
  }, [ isEdit ]);


  useEffect(() => 
  {
    if(isOutsideClick && isEdit)
    {
      databaseCommonNoteCrud.putWithStore(create_at, { message: text }).then(() => 
      {
        databaseCommonNoteCrud.get(create_at).then(res => 
        {
          setText(res ? res.message : '');
          setIsEdit(false);
          
        });
            
      });
      
    }
  }, [ isOutsideClick ]);

  
  const Styles = {
    main_container: 'w-[1005px] bg-main text-[13px] pb-[10px] pt-[10px]',
    date_info: 'w-[58px] h-[30px] ml-[79px]',
    container: 'flex ml-[79px] text-[13px] mt-[2px]',
    innerText: 'inline-block ml-[17px]',
    file_icon: 'w-[49px] h-[49px]',
    input_container: 'w-[100%]',
    input: 'w-[100%]',
    
  };
  
  return(
    <div className={`${Styles.main_container}`}>
      <div className={`${Styles.date_info}`}>
        <span className='inline-block leading-[15px]'>{new DateWithSecondPrecision(create_at) + ''}</span>
      </div>

      <div className={`${Styles.container}`} ref={ref}>
        <FaFileAlt className={Styles.file_icon} color={'#5BCEFF'}/>
        
        <div className={Styles.input_container} onClick={() => setIsEdit(true)}>
          {isEdit ? 
            <textarea className={Styles.input} ref={textareaRef} onChange={e => setText(e.target.value)}/>:
            <span className={Styles.innerText}>{text}</span>
          }   
        </div>
      </div>
    </div>
  );
};


const CommonNotes: FC<{find_date: string}> = ({ find_date }) => 
{
  const [ notes, setNotes ] = useState([] as TStoreCommonNote[]); 
  const signalData = useCacheSignal<TStoreCommonNote[]>(signalCacheCommonNoteUpdate);
  

  const handler = () => 
  {
    // @ts-ignore
    setNotes(signalData.filter(obj => obj.day_of_month === find_date));
    
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
      setSelectDate(signalSelectDate.value);
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

export const CommonNotesWithStore = () => 
{
  const date = new DateWithDayPrecision(hooks.selector.useDate());

  return(
    <CommonNotes find_date={date + ''}/>

  );
};