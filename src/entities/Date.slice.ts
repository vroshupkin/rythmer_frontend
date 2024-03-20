import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DateTools } from '../shared/DateTools';
import { TStoreActionWithPayload } from '../shared/ReduxTypes';
import { useSelector } from 'react-redux';

export type TDateSliceState = { date: string }
export enum DATE_SLICE {NAME = 'dateSlice'}

const actions_handlers = {
  addDay: (state: TDateSliceState, action: PayloadAction<number>) =>
  {
    state.date = DateTools.addDay(new Date(state.date), action.payload) + '';
  },

  num: (state: TDateSliceState, action: PayloadAction<number>) =>
  {
    state.date = DateTools.addDay(new Date(state.date), action.payload) + '';
  },
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
    {type: `${DATE_SLICE.NAME}/num`, payload: number}


export const  dateSliceActions = dateSlice.actions;

export const hooks = {
  selector: {
    useDate: useSelector<TDateSliceState, Date>((state) => new Date(state.date))
  }
};