import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { setDate } from '../shared/DateTools';

export type TDateSliceState = { selectedMonth: string,  date: string }
export enum DATE_SLICE {NAME = 'dateSlice'}


const actions_handlers = {
  
  changeDate: (state: TDateSliceState, action: PayloadAction<string>) => 
  {
    state.date = new Date(action.payload) + '';
  }
};


export const dateSlice = createSlice({
  name: DATE_SLICE.NAME,
  initialState: {
    // Прочесть из кеша
    selectedMonth: new setDate(new Date()).setMidnight().date + '',
    date: new setDate(new Date()).setMidnight().date + ''
  },
  reducers: {
    ...actions_handlers
  },
  selectors: {
    selectedMonth: (state) => state.selectedMonth
  }
});

export const hooks = {
  selector: {
    useSelectedMonth: () => useSelector<TDateSliceState, Date>((state) => new Date(state.selectedMonth)),
    useDate: () => useSelector<TDateSliceState, string>(state => state.date)
  }
};

export const { changeDate } = dateSlice.actions;
