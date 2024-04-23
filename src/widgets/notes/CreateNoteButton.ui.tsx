import { FC } from 'react';
import { hooks } from '../../entities/Date.slice';
import { TSelectType } from './NoteSelector';
import { databaseCommonNoteCrud } from '../../features/Database.tables';
import { DateWithDayPrecision } from '../../shared/DateTools';


export const CreateNoteButton: FC<{className: string, type: TSelectType}> = ({ type, className }) => 
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
  
  const day_of_month = new DateWithDayPrecision(hooks.selector.useDate()) + '' ;

  const click: React.MouseEventHandler<HTMLDivElement> = (e) => 
  {
    
    switch(type)
    {
    case 'common':
    {
      databaseCommonNoteCrud.putWithStore(new Date + '', { message: '', day_of_month });
    }
    }
  };
  
  return(
    <div className={`${className}`}>
      <div className={`${Styles.container}`} onClick={click}>
        <span>{selector[type] ?? 'Добавить заметку'}</span>
      </div>
      
    </div>

  );
};