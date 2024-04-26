import { useState } from 'react';


const getPathOfComponent = (name: string, err: Error) => 
{
  const str = err.stack?.split('\n')[1];
  
  let path = str?.
    split('/')?.
    slice(3).
    join('/');

  path = path?.slice(0, path.indexOf('?t'));

  
  return `${path} <${name}/>`;
};

/**
 * Показывает путь к файлу компонента в popup меню при наведении на компонент
 * @param component_name Имя компонента в файле
 * @param err Ошибка из которой достается stacktrace для отслеживания пути
 * @returns example: src/widgets/notes/NoteSelector.tsx SelectIcon
 * 
 */
export const useHoverPath = (component_name: string, err: Error) => 
{
  const [ isHover, setIsHover ] = useState(false);

  const component = () => <>
    {isHover 
      ? <div 
        className='absolute text-[12px] bg-main  z-50 border-[1px] bottom-[50px] left-[25px] rounded-[5px]'
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {getPathOfComponent(component_name, err)}
      </div>
      : <></>
        
    }
  </>;

  return [ component, setIsHover ] as const;    

  
};