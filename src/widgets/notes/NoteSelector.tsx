import { FC, useState } from 'react';
import { IconType } from 'react-icons';
import { FaCarSide, FaCarrot, FaFileAlt, FaHammer, FaShower, FaSkating } from 'react-icons/fa';
import { CreateNoteButton } from './CreateNoteButton.ui';

export type TSelectType = 'common' | 'sport' | 'food' | 'higiene' | 'household chores' | 'travel';

export const NoteSelector: FC<{className: string}> = ({ className }) => 
{
  const Styles = {
    container: 'w-[422px] h-[55px] flex justify-between',
    icon: 'w-[52px] h-[52px] cursor-pointer bg-main hover:bg-main_hover',
    file: 'bg-[#5BCEFF] '
  };
  
  const [ selectType, setSelectType ] = useState('');

  const click = (str: string) => 
  {
    setSelectType(str);
  };

  return(
    <div className={`${className}`}>
      <div className={`${Styles.container}`}>
        <Icon Icon={FaFileAlt} color='#5BCEFF' type='common' selectType={selectType} onClick={click}/>
        <Icon Icon={FaSkating} color='#21BEE0' type='sport' selectType={selectType} onClick={click}/>
        <Icon Icon={FaCarrot} color='#F37934' type='food' selectType={selectType} onClick={click}/>
        <Icon Icon={FaShower} color='#3971FF' type='higiene' selectType={selectType} onClick={click}/>
        <Icon Icon={FaHammer} color='#FF8170' type='household chores' selectType={selectType} onClick={click}/>
        <Icon Icon={FaCarSide} color='#777CFF' type='travel' selectType={selectType} onClick={click}/>
      </div>

      <CreateNoteButton className='flex justify-center w-[422px] mt-[21px]' type={selectType as TSelectType}/>
    </div>
  );
};

const Icon: FC<{
    Icon: IconType,
    color: string,
    onClick: (str: string) => void,
    type: TSelectType,
    selectType: string
}> = ({ Icon, color, onClick, type, selectType }) => 
{
    
  const Styles = {
    icon: 'w-[52px] h-[52px] cursor-pointer bg-main hover:bg-main_hover',
    select: {
      true: 'bg-select hover:bg-select_hover',
      false: 'bg-main hover:bg-main_hover'
    }  
  };
  
  const Click = () => 
  {
    onClick(type);
  };

  return(
    <>
      <Icon 
        className={`${Styles.icon} ${type === selectType? Styles.select.true : Styles.select.false}`} 
        onClick={Click}
        color={color}
      />
    </>
  );
};

