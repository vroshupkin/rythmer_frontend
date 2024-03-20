
/**
  * @example select_mask([0, 1, 2, 3, 4, 5], 2, 3) =>
  *  [false, true, true, true, false, false]
  */
export const select_mask = (arr: number[], ind: number, width: number) =>
{
  const boolean_arr = arr.map(_ => false);
  const select_items = (op: '+' | '-') => (ind: number, counts: number) => 
  {
    while(counts)
    {
      op === '+'? ind += 1 : ind -=1;
      if(ind >= arr.length || ind < 0)
      {
        break;
      }

      boolean_arr[ind] = true;
      counts--;
    }
  };
  const select_items_right = select_items('+');
  const select_items_left = select_items('-');
    
  boolean_arr[ind] = true;
  width -= 1;
  select_items_right(ind, Math.ceil(width / 2));
  select_items_left(ind, Math.floor(width / 2));

  return boolean_arr;
};

  