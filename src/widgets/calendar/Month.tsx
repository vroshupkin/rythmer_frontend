import React, { FC } from 'react';
import { signalSelectDate } from '../../pages/Main.signals';
import { CountDaysOfMonth, MonthName, setDate } from '../../shared/DateTools';


type TMonthProps = {
  className?: string,
   FirstDayOfMonth: Date,
   clickGetDayAndMonth?: (day: number, month: number) => void
  }

export const Month: FC<TMonthProps> = ({ className, FirstDayOfMonth, clickGetDayAndMonth }) => 
{
  const click = (day: number) => 
  {
    clickGetDayAndMonth? clickGetDayAndMonth(day, FirstDayOfMonth.getMonth()) : '';
  };

  return(
    <section className={`select-none flex flex-col justify-center w-[100%] ${className}`}>
      <MonthTittle monthOrder={FirstDayOfMonth.getMonth()}/>
      <WeekTittle/>
      <Days FirstDayOfMonth={FirstDayOfMonth} clickGetDay={click}/>
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
      {week_arr.map((name, key) => 
        <div key={key} className='bg-main w-[50px] h-[50px] flex justify-center items-center font-bold'>
          <span>{name}</span>
        </div>
      )}
    </div>
  );
};

type TPropsDays = {
  FirstDayOfMonth: Date, 
  clickGetDay?: (day: number) => void
}

const Days: FC<TPropsDays> = ({ FirstDayOfMonth,  clickGetDay }) => 
{ 
  const offset = FirstDayOfMonth.getDay() === 0? 6 : FirstDayOfMonth.getDay() - 1;
  const count = CountDaysOfMonth.getDays(FirstDayOfMonth.getMonth(), FirstDayOfMonth.getFullYear());
  
  const offset_empty_days = Array(offset).fill('');
  const days = [ ... Array(count).keys() ].map( v => v + 1);
  
  const after_empty_days = [ ... Array(42 - count - offset).fill('') ];
  
  
  return(
    <div className='flex flex-wrap h-[300px] w-[350px]'>
      {offset_empty_days.map((_, key) => 
        <React.Fragment key={key}>
          <EmptyDayCell/>
        </React.Fragment>
      )}
        
      {days.map((day, key) => 
        <React.Fragment key={key}>
          <DayCellWithStore 
            onClick={clickGetDay}
            day={day}
            key={key}
            FirstDayOfMonth={FirstDayOfMonth}
          />
        </React.Fragment>
        
      )} 
      {after_empty_days.map((_, key) => 
        <React.Fragment key={key}>
          <EmptyDayCell/>
        </React.Fragment>
      )}
    </div>
    
  );
};


const DayCellWithStore: FC<{day: number, FirstDayOfMonth: Date, onClick?: (num: number) => void}> = (
  { day, FirstDayOfMonth, onClick }) => 
{


  const isSelectedDay = () => 
    signalSelectDate.value.getMonth() === FirstDayOfMonth.getMonth() && 
    signalSelectDate.value.getFullYear() === FirstDayOfMonth.getFullYear() && 
    signalSelectDate.value.getDate() === day;
  

  const click = () => 
  {
    const date = new setDate(FirstDayOfMonth).setDay(day).setMidnight().date;
    signalSelectDate.value = date;
    
    onClick ? onClick(day) : '';
    
  };

  const Styles = {
    common: 'cursor-pointer w-[50px] h-[50px] flex justify-center items-center ',
    active: 'bg-select hover:bg-select_hover w-[100%] h-[100%] flex justify-center items-center rounded-[50px]' + 
    ' border-[1px]',
    unactive: 'bg-main hover:bg-main_hover',
    
  };

  return(
    <div 
      onClick={click}
      className={`${Styles.common} ${Styles.unactive}`}
    > 
      <div className={`${isSelectedDay()? Styles.active : ''}`}>
        <span>{day}</span>
      </div>
    </div>
  );
};
  

const EmptyDayCell: FC = () => 
  <div className={'bg-main w-[50px] h-[50px] flex justify-center items-center'}>
    <span></span>
  </div>;
