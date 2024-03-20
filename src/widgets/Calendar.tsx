import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { dateSliceActions, hooks } from '../entities/Date.slice';
import { MonthName } from '../shared/DateTools';
import { TDateStoreUseDispatch } from '../entities/Date.store';


export const Calendar: FC = () => 
{
  const date = hooks.selector.useDate();
  const dispatch = useDispatch<TDateStoreUseDispatch>();

  const change_month = (month_order: number) => 
  {
    const new_date = new Date(date);

    new_date.setMonth(month_order - 1);  
    new_date.setFullYear(date.getFullYear());  
    
    dispatch({ type: 'dateSlice/changeDate', payload: new_date + '' });
  };

  return(  
    <div className='flex flex-col w-[100%]'>
      <YearInput className='mt-[28px]' date={new Date()}/>
      <MonthSelector onClick={change_month} className='mt-[21px]'/>
      <DateView className={'mt-[25px]'} date={date}/>
      <DateInput/>
    </div>
      
  );
};


const DateInput: FC = () => 
{
  const dispatch = useDispatch<TDateStoreUseDispatch>();

  
  const addDayHanlder = (num: number) => 
  { 
    dispatch(dateSliceActions.addDay(num));
  };

  
  const class_name = 'border-[2px] border-[black] rounded-md hover:bg-[gray]';
  
  return(
    <section>
      <button className={class_name} onClick={_ => addDayHanlder(1)}>Add day</button>
      <button className={class_name} onClick={_ => addDayHanlder(-1)}>Minus Day</button>
    </section>
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

const MonthSelector: FC<{
    className?: string,
    onClick?: (num: number) => void
}> = ({ className, onClick }) => 
{
  const [ order, setOrder ] = useState(4);  
  const month_arr = [ 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0 ];

  const get_selected_items = () => 
  {
    return month_arr.map((_, ind) => 
      ind === order? 'center' : 
        ind === order - 1? 'left' :
          ind === order + 1? 'right':
            'default'
    ); 
  };

  const selected_items = get_selected_items();

  const click = (num: number) => 
  {
    
    if(onClick)
    {
      onClick(num);
    }
    setOrder(num);
  };
  
  return (
    <section className={`flex justify-center w-[100%] ${className}`}>
      <div className='flex flex-row w-[700px] h-[50px] bg-main'>
        {month_arr.map((v, k) => 
        {
          return(
            <MonthElement
              onClick={click}
              id={k} key={k} select_month={v} select={selected_items[k]}/>
          );
        }
          
        )}
        
      </div>
    </section>
  );
};

type MonthElementSelect = 'left' | 'center' | 'right' | 'default';

const MonthElement: FC<{
    select_month: number,
    select: MonthElementSelect, 
    id?: number,
    onClick?: (num: number) => void
}>
 = (
   { select_month, select, id, onClick }) => 
 {
  
   const months = [ 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек' ];
   const common_select_Styles = 'select-none bg-select hover:bg-select_hover cursor-pointer border-t-[2px] border-b-[2px]';

   const Styles = {
     left: `rounded-tl-[50px] rounded-bl-[50px] border-l-[2px] ${common_select_Styles}` ,
     center: `${common_select_Styles}` ,
     right: `border-r-[2px] rounded-tr-[50px] rounded-br-[50px] ${common_select_Styles}` ,

     default: 'select-none bg-main_select hover:bg-main_hover cursor-pointer'
   };
    
   const click: React.MouseEventHandler = () => 
   {
     onClick? onClick(id ?? -1) : false;
   };
  
   return(
     <div className=' w-[50px] h-[50px]' onClick={click}>
       <div className={`flex items-center justify-center w-[100%] h-[100%] ${Styles[select]}`}>
         <span>{months[select_month]}</span>
       </div>
      
     </div>
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