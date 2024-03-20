import { configureStore } from '@reduxjs/toolkit';
import { TDateSliceActions, dateSlice } from './Date.slice';

export const date_store = configureStore({
  reducer: dateSlice.reducer ,
  preloadedState: dateSlice.getInitialState()
});

export type TDateStoreUseDispatch = typeof date_store.dispatch<TDateSliceActions>;

