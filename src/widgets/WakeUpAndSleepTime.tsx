import { FC, useEffect, useRef, useState } from 'react';
import { FaSun } from 'react-icons/fa';
import { crud } from '../entities/Database';
import { hooks } from '../entities/Date.slice';
import { useClickInside } from '../shared/useClickInside';

export const WakeUpOrSleep: FC<{
    className: string,
    updateVal: typeof crud.updateWakeUp | typeof crud.updateSleepTime,
    getType: 'wake_up' | 'faling_sleep'

}> = ({ className, updateVal, getType }) => 
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

  const date = hooks.selector.useDate();

  const [ val, setVal ] = useState('');
  const [ isEdit, setIsEdit ] = useState(false);

  useEffect(() => 
  {
    crud.getSleepWakeupTime(new Date(date)).then(res => 
    { 
      setVal(res && res[getType]? res[getType] : '');
    });
  }, [ date ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const isInsideClick = useClickInside(containerRef);

  useEffect(() => 
  {
    if(!isInsideClick && isEdit && inputRef.current)
    {
      updateVal(new Date(date), inputRef.current.value).then(() => 
      {
        // @ts-ignore
        setVal(inputRef.current.value);
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
      {/* <FaSun className={Styles.icon} color='#FCFF5B'/> */}
      <Icon/>
      <div className={Styles.text_container} >
        
        {isEdit? 
          <input type='text' className={Styles.input} ref={inputRef}/> : 
          <span className={Styles.span}>{val}</span>}
      </div>
    </div>
  );
};