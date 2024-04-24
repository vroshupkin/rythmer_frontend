import { FC } from 'react';
import { databaseCommonNoteCrud } from '../../features/Database.tables';
import { DateWithDayPrecision } from '../../shared/DateTools';
import { TSelectType } from './NoteSelector';

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

  const click: React.MouseEventHandler<HTMLDivElement> = (e) => 
  {
    
    switch(type)
    {
    case 'common':
    {
      databaseCommonNoteCrud.putWithSignal(new Date + '', { message: '', day_of_month });
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