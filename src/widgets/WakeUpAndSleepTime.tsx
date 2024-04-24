import { FC, useEffect, useRef, useState } from 'react';
import { FaSun } from 'react-icons/fa';

import { useSignals } from '@preact/signals-react/runtime';
import { databaseSleepRoutine } from '../features/Database.tables';
import { useClickInside } from '../shared/useClickInside.hook';

type TPropsWakeUpOrSleep = {
  className?: string,
  updateVal: typeof databaseSleepRoutine,
  getType: 'wake_up' | 'faling_sleep',
  findDate: Date
}

export const WakeUpOrSleep: FC<TPropsWakeUpOrSleep> = ({ className, updateVal, getType, findDate }) => 
{
  const Styles = {
    main: 'w-[150px] h-[50px] cursor-pointer flex',
    edit_false: 'bg-main hover:bg-main_hover',
    edit_true: 'bg-edit',
    wakeup_icon: 'w-[50px] h-[50px]',
    text_container: 'w-[100px] h-[50px] flex justify-center items-center',
    span: 'text-[24px]',
    input: 'w-[100px] h-[50px] text-center bg-edit text-[24px]'
  };


  const [ val, setVal ] = useState('');
  const [ isEdit, setIsEdit ] = useState(false);

  useEffect(() => 
  {
    databaseSleepRoutine.get(new Date(findDate)).then(res => 
    {
      setVal(res && res[getType]? res[getType] : '');
    });
  }, [ findDate ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const isInsideClick = useClickInside(containerRef);

  useEffect(() => 
  {
    if(!isInsideClick && isEdit && inputRef.current)
    {
      const val = inputRef.current.value;
      const input: Partial<Record<typeof getType, string>> = {};
      input[getType] = val;

      updateVal.put(new Date(findDate), input).then(() => 
      {
        setVal(val);
        setIsEdit(false);
      });
    }
    
  }, [ isInsideClick ]);
  

  useEffect(() => 
  {
    if(isEdit && inputRef.current)
    {  
      inputRef.current.value = val;
      inputRef.current.focus();
       
    }
  }, [ isEdit ]);
  
  useSignals();
  const Icon: FC = () =>
  {
    return(
      <>
        {
          getType === 'wake_up'? 
            <FaSun className={Styles.wakeup_icon} color='#FCFF5B'/>:
            <div className='w-[50px] h-[50px]'>
              <div className='w-[44px] h-[33px] flex justify-center  ml-[4px] mt-[10px] rounded-[25px] bg-[#1922F2]'>
                <span className='inline-block leading-[30px] text-[#fff] font-[14px]'>zzz...</span>
              </div>
            </div>
        }
      </>
            
    );
  }; 
  
  return(
    <div 
      className={`${className} ${Styles.main} ${isEdit ? Styles.edit_true : Styles.edit_false}`} 
      onClick={() => !isEdit ? setIsEdit(true) : ''}
      ref={containerRef}
    >
      <Icon/>
      <div className={Styles.text_container} >
        
        {isEdit? 
          <input type='text' className={Styles.input} ref={inputRef}/> : 
          <span className={Styles.span}>{val}</span>}
      </div>
    </div>
  );
};