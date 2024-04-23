import { computed, signal } from '@preact/signals-react';
import { setDate } from '../../shared/DateTools';

const date = new Date();
export const signalSelectDate = signal(date);


