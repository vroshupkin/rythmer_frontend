import { configureStore } from '@reduxjs/toolkit';
import { FC } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { TDateSliceActions, TDateSliceState, dateSlice, dateSliceActions, hooks } from '../entities/Date.slice';

const store = configureStore({
  reducer: dateSlice.reducer ,
  preloadedState: dateSlice.getInitialState()
});

type TStoreUseDispatch = typeof store.dispatch<TDateSliceActions>;


export const Main: FC  = () => 
{
  return(
    <Provider store={store}>
      <DateView/>
      <DateInput/>
    </Provider>
  );
};


const DateView: FC = () => 
{
  const date = hooks.selector.useDate();
 
  return(
    <div>{`${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`}</div>
  );
};

const DateInput: FC = () => 
{
  const dispatch = useDispatch<TStoreUseDispatch>();

  
  const addDayHanlder = (num: number) => 
  { 
    dispatch(dateSliceActions.addDay(num));
  };

  
  const class_name = 'border-[2px] border-[black] rounded-md hover:bg-[gray]';
  
  return(
    <>
      <button className={class_name} onClick={_ => addDayHanlder(1)}>Add day</button>
      <button className={class_name} onClick={_ => addDayHanlder(-1)}>Minus Day</button>
    </>
  );
};

