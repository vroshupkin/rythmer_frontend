import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

export type TDateSliceState = { selectedMonth: string,  date: string }
export enum DATE_SLICE {NAME = 'dateSlice'}

const actions_handlers = {
  changeSelectedMonth: (state: TDateSliceState, action: PayloadAction<string>) => 
  {
    state.selectedMonth = new Date(action.payload) + ''; 
  },

  changeDate: (state: TDateSliceState, action: PayloadAction<string>) => 
  {
    state.date = new Date(action.payload) + '';
  }
};


export const dateSlice = createSlice({
  name: DATE_SLICE.NAME,
  initialState: {
    // Прочесть из кеша
    selectedMonth: new Date() + '',
    date: new Date + ''
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
    useDate: () => useSelector<TDateSliceState, Date>((state) => new Date(state.date))
  }
};

export const { changeDate, changeSelectedMonth } = dateSlice.actions;
