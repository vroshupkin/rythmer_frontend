import { FC, useEffect, useRef } from 'react';
import { databaseCommonNoteCrud } from '../../features/Database.tables';
import { DateWithDayPrecision } from '../../shared/DateTools';
import { TSelectType } from './NoteSelector';
import { useHoverPath } from '../../shared/useMouseHover';

type TPropsCreateNoteButton = {
  className: string,
  type: TSelectType,
  selectDate: Date
}
export const CreateNoteButton: FC<TPropsCreateNoteButton> = ({ type, className, selectDate }) => 
{
  const Styles = {
    container: 'font-Inter text-[16px] text-center w-[325px] h-[50px] bg-main select-none ' + 
    'hover:bg-main_hover cursor-pointer flex justify-center items-center'
  };


  const selector: Record<TSelectType, string> = {
    common: 'Добавить обычную заметку',
    'household chores': 'Добавить заметку о домашних делах',
    food: 'Добавить заметку о питании',
    higiene: 'Добавить заметку о гигиене',
    sport: 'Добавить заметку о физической активности',
    travel: 'Добавить заметку о поездке'
  };
  
  const day_of_month = new DateWithDayPrecision(selectDate) + '' ;

  const click: React.MouseEventHandler<HTMLDivElement> = () => 
  {
    
    switch(type)
    {
    case 'common':
    {
      databaseCommonNoteCrud.putWithSignal(new Date + '', { message: '', day_of_month });
    }
    }
  };
  
  const [ HoverComponent, setIsHover ] = useHoverPath('CreateNoteButton', new Error());
  
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => 
  {
    ref.current?.addEventListener('mouseenter', () => setIsHover(true));
    ref.current?.addEventListener('mouseleave', () => setIsHover(false));
    ref.current?.classList.add('relative');
    
    console.log(ref.current?.onmouseenter);
    
  }, [ ref ]);
  
  return(
    <div className={`${className}`} ref={ref}>
      <div className={`${Styles.container}`} onClick={click}>
        <span>{selector[type] ?? 'Добавить заметку'}</span>
      </div>
      <HoverComponent/>
    </div>

  );
};