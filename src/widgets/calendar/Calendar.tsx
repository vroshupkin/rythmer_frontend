import { useSignals } from '@preact/signals-react/runtime';
import { FC } from 'react';
import { MonthName, setDate } from '../../shared/DateTools';
import { Month } from './Month';
import { signalSelectDate } from './Month.signals';
import { MonthSelector } from './MonthSelector';
import { computed } from '@preact/signals-react';


export const Calendar: FC = () => 
{
  useSignals();
  
  const [ signalPrevMoth, signalCenterMonth, signalNextMonth ] = 
  [ computed(() => new setDate(signalSelectDate.value).setDay(1).changeMonth(-1).date),
    computed(() => new setDate(signalSelectDate.value).setDay(1).changeMonth(0).date),
    computed(() => new setDate(signalSelectDate.value).setDay(1).changeMonth(1).date)
  ];


  return(  
    <div className='flex flex-col w-[100%]'>
      {/* <YearInput className='mt-[28px]' date={new Date()}/> */}
      {/* <MonthSelector onClick={change_month} className='mt-[21px]'/> */}
      <MonthSelector className='mt-[21px]'/>
      
      <div className='flex justify-center'>
        <div className='flex w-[1090px] mt-[21px]'>
          <Month
            FirstDayOfMonth={signalPrevMoth.value}
          />
          <Month 
            FirstDayOfMonth={signalCenterMonth.value}
          />
          <Month 
            FirstDayOfMonth={signalNextMonth.value}
          />
        </div>
      </div>

      <DateView className={'mt-[25px]'} date={signalSelectDate.value}/>
      
        
    </div>
      
  );
};


const YearInput: FC<{date: Date, className?: string}> = ({ date, className }) => 
{
  return(
    <section className={`flex justify-center w-[100%] select-none cursor-pointer ${className}`}>
      <div className='flex items-center justify-center w-[350px] h-[50px] bg-main hover:bg-main_hover'>
        <span>{date.getFullYear()}</span>
      </div>
    </section>   
  );
};


const DateView: FC<{
  date: Date,
  className: string
}> = ({ date, className }) => 
{

  const month_name = () => 
  {
    const month = MonthName.genetive(date.getMonth());
    
    return month[0].toUpperCase() + month.slice(1);
  };
  
  return(
    <section className={`select-none flex justify-center w-[100%] ${className}`}>
      <div className='flex justify-center items-center w-[150px] h-[50px] bg-main hover:bg-main_hover'>
        <span>
          <div>{`${date.getDate()} ${month_name()} ${date.getFullYear()}`}</div>
        </span>
      </div>
    </section>
  );
};