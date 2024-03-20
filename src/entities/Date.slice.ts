import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { DateTools } from '../shared/DateTools';

export type TDateSliceState = { date: string }
export enum DATE_SLICE {NAME = 'dateSlice'}

const actions_handlers = {
  addDay: (state: TDateSliceState, action: PayloadAction<number>) =>
  {
    const date = new Date(state.date);
    state.date = DateTools.addDay(date, action.payload) + '';
  },

  changeDate: (state: TDateSliceState, action: PayloadAction<Date>) => 
  {
    console.log('change');
    state.date = new Date(action.payload) + '';
    
  }
};


export const dateSlice = createSlice({
  name: DATE_SLICE.NAME,
  initialState: {
    date: new Date() + ''
  },
  reducers: {
    ...actions_handlers
  },
  selectors: {
    date: (state) => state.date
  }
});


export type TDateSliceActions = 
    {type: `${DATE_SLICE.NAME}/addDay`, payload: number} | 
      {type: `${DATE_SLICE.NAME}/changeDate`, payload: string} 


export const  dateSliceActions = dateSlice.actions;

export const hooks = {
  selector: {
    useDate: () => useSelector<TDateSliceState, Date>((state) => new Date(state.date))
  }
};

