import { useEffect, useState } from 'react';

export const useClickInside = <T>(ref: React.RefObject<T>) => 
{
  const [ isInsideClick, setIsInsideClick ] = useState(true);
    
  useEffect(() => 
  {
    const handler = (ev: MouseEvent) => 
    {
      setIsInsideClick(
        // @ts-ignore
        ref.current && ref.current.contains(ev.target)
      );
    };

    document.addEventListener('mousedown', handler);

    return () => document.removeEventListener('mousedown', handler);
  });
  
  return isInsideClick;
};