import { FC } from 'react';
import { Provider } from 'react-redux';
import { date_store } from '../entities/Date.store';
import { Calendar } from '../widgets/Calendar';
import { LeftMenu } from '../widgets/LeftMenu';


export const Main: FC  = () => 
{
  return(
    <div className='flex items-start'>
      <LeftMenu/>

      <Provider store={date_store}>
        <Calendar/>
      </Provider>
      
    </div>
  );
};


