import { FC } from 'react';
import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { DateTools } from '../shared/DateTools';

type TDateSliceState = {date: Date}


const dateSlice = createSlice({
  name: 'dateSlice',
  initialState: {
    date: new Date()
  },
  reducers: {
    addDay: (state: TDateSliceState, action: PayloadAction<number>) => 
    {
      state.date = DateTools.addDay(state.date, action.payload);
    }
  },
  selectors: {
    date: (state) => state.date
  }
});


const { addDay } = dateSlice.actions;


const store = configureStore({
  reducer: dateSlice.reducer ,
  preloadedState: dateSlice.getInitialState()
});

type TStoreUseDispatch = typeof store.dispatch;

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
  
  // @ts-ignore
  const date = useSelector((state: {date: Date}) => state.date);

  
  return(
    <div>{`${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`}</div>
  );
};

const DateInput: FC = () => 
{
  // 
  // const dispatch = useDispatch.withTypes<TStoreUseDispatch>();
  const dispatch = useDispatch();

  
  const addDayHanlder = (num: number) => 
  {
    console.log(addDay(num));
    
    // @ts-ignore
    dispatch(addDay(num));
  };

  
  const class_name = 'border-[2px] border-[black] rounded-md hover:bg-[gray]';
  
  return(
    <>
      <button className={class_name} onClick={_ => addDayHanlder(1)}>Add day</button>
      <button className={class_name} onClick={_ => addDayHanlder(-1)}>Minus Day</button>
    </>
  );
};

