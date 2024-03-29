import { FC } from 'react';
import { CountDaysOfMonth, MonthName, setDate } from '../shared/DateTools';
import { changeDate, hooks } from '../entities/Date.slice';
import { useDispatch } from 'react-redux';
import { TDateStoreUseDispatch } from '../entities/Date.store';


type TMonthProps = {className?: string, FirstDayOfMonth: Date}
export const Month: FC<TMonthProps> = ({ className, FirstDayOfMonth }) => 
{
  
  return(
    <section className={`select-none flex flex-col justify-center w-[100%] ${className}`}>
      <MonthTittle monthOrder={FirstDayOfMonth.getMonth()}/>
      <WeekTittle/>
      <Days FirstDayOfMonth={FirstDayOfMonth}/>
    </section>
    
  );
};

const MonthTittle: FC<{monthOrder: number}> = ({ monthOrder }) => 
{
  const monthName = MonthName.nominative(monthOrder);
  
  return(
    <div className='bg-main flex justify-center items-center w-[350px] h-[38px] text-[21px]'>
      <span>{monthName[0].toUpperCase() + monthName.slice(1)}</span>
    </div>
      
  );
};

const WeekTittle: FC = () => 
{
  const week_arr = [ 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс', ];
  
  return(
    <div className='flex '>
      {week_arr.map((name) => 
        <div className='bg-main w-[50px] h-[50px] flex justify-center items-center font-bold'>
          <span>{name}</span>
        </div>
      )}
    </div>
  );
};

const Days: FC<{FirstDayOfMonth: Date}> = ({ FirstDayOfMonth }) => 
{ 

  const offset = FirstDayOfMonth.getDay() === 0? 6 : FirstDayOfMonth.getDay() - 1;
  const count = CountDaysOfMonth.getDays(FirstDayOfMonth.getMonth(), FirstDayOfMonth.getFullYear());
  
  const offset_empty_days = Array(offset).fill('');
  const days = [ ... Array(count).keys() ].map( v => v + 1);
  
  const after_empty_days = [ ... Array(42 - count - offset).fill('') ];
  
  
  return(
    <div className='flex flex-wrap h-[300px] w-[350px]'>
      {offset_empty_days.map(EmptyDayCell)}
      {days.map(day => 
        <DayCellWithStore 
          day={day}
          FirstDayOfMonth={FirstDayOfMonth}
        />)} 
      {after_empty_days.map(EmptyDayCell)}
    </div>
    
  );
};


const DayCellWithStore: FC<{day: number, FirstDayOfMonth: Date}> = ({ day, FirstDayOfMonth }) => 
{


  const date = hooks.selector.useDate();

  const isSelectedDay = () => 
    date.getMonth() === FirstDayOfMonth.getMonth() && 
    date.getFullYear() === FirstDayOfMonth.getFullYear() && 
    date.getDate() === day;
  
  const dispatch = useDispatch<TDateStoreUseDispatch>();

  const onClick = () => 
  {
    const date = new setDate(FirstDayOfMonth).setDay(day).date;
    
    dispatch(changeDate(date + ''));
  };

  const Styles = {
    common: 'cursor-pointer w-[50px] h-[50px] flex justify-center items-center ',
    active: 'bg-select hover:bg-select_hover',
    unactive: 'bg-main hover:bg-main_hover',
    
  };


  return(
    <div 
      onClick={onClick}
      className={`${Styles.common} ${isSelectedDay() ? Styles.active : Styles.unactive}`}
    >
      <span>{day}</span>
    </div>
  );
};
  

const EmptyDayCell: FC = () => 
  <div className={'bg-main w-[50px] h-[50px] flex justify-center items-center'}>
    <span></span>
  </div>;
