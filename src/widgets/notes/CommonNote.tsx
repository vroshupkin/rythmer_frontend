import { FC, useEffect, useRef, useState } from 'react';

import { FaFileAlt } from 'react-icons/fa';
import { TStoreCommonNote } from '../../features/CommonNote.table';
import { databaseCommonNoteCrud } from '../../features/Database.tables';
import { DateWithSecondPrecision } from '../../shared/DateTools';
import { useClickInside } from '../../shared/useClickInside.hook';


type TPropsCommonNote = Pick<TStoreCommonNote, 'create_at' | 'message' | 'day_of_month'>


export const CommonNote: FC<TPropsCommonNote> = ({ create_at, message, day_of_month }) => 
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
      databaseCommonNoteCrud.putWithSignal(create_at, { message: text }).then(() => 
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

