import { Signal, effect } from '@preact/signals-react';
import { useEffect, useRef, useState } from 'react';

/**
 * Сохраняет в оперативную память данные и уже достает из них, а не запрашивая постоянно
 */
export const useCacheSignal = <T>(signal: Signal<{data: T, lastUpdate: Date}>) => 
{
  const lastUpdate = useRef(new Date(0));
  const [ data, setData ] = useState<T | undefined>(undefined);

  useEffect(effect(() => 
  {
    if(lastUpdate.current != signal.value.lastUpdate)
    {
      setData(signal.value.data);
      lastUpdate.current = signal.value.lastUpdate;
    }
  }));

  return data;
};


