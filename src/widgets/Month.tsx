import { FC } from 'react';
import { CountDaysOfMonth, MonthName } from '../shared/DateTools';


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
  const after_empty_days = [ ... Array(35 - count - offset).fill('') ];
  
  return(
    <div className='flex flex-wrap h-[250px] w-[350px]'>
      {offset_empty_days.map(EmptyDayCell)}
      {days.map(day => <DayCell name={day + ''}/>)} 
      {after_empty_days.map(EmptyDayCell)}
    </div>
    
  );
};


const DayCell: FC<{name: string}> = ({ name }) => 
  <div className={'bg-main hover:bg-main_hover cursor-pointer w-[50px] h-[50px] flex justify-center items-center'}>
    <span>{name}</span>
  </div>;

const EmptyDayCell: FC = () => 
  <div className={'bg-main w-[50px] h-[50px] flex justify-center items-center'}>
    <span></span>
  </div>;
