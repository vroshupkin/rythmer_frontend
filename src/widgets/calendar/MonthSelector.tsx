import { FC, useEffect, useState } from 'react';
import { signalSelectDate } from '../../pages/Main.signals';


export const MonthSelector: FC<{
    className?: string,
    onClick?: (num: number) => void
}> = ({ className, onClick }) => 
{
  const [ order, setOrder ] = useState(4);  
  const month_arr = [ 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0 ];

  
  useEffect(() => 
  {
    const month = signalSelectDate.value.getMonth();
    if(month_arr[order] != month)
    {
      signalSelectDate.value.setMonth(month_arr[order]);
      signalSelectDate.value = new Date(signalSelectDate.value);
    }
    
    
  }, [ order ]);
  

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
