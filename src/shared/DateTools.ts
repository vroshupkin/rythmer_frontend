export const DateConstant = {
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24
};

export class DateTools
{
  private static changeDate = (constant: number) => (date: Date, coeff: number) =>
    new Date(Number(date) + coeff * constant);

  static addSecond = this.changeDate(DateConstant.second);
  static addMinute = this.changeDate(DateConstant.minute);
  static addHour = this.changeDate(DateConstant.hour);
  static addDay = this.changeDate(DateConstant.day);
  
}

export class MonthName
{
  static months = [
    [ 'январь',   'января' ],
    [ 'февраль',  'февраля' ],
    [ 'март',     'марта' ],
    [ 'апрель',   'апреля' ],
    [ 'май',      'мая' ],
    [ 'июнь',     'июня' ],
    [ 'июль',     'июля' ],
    [ 'август',   'августа' ],
    [ 'сентябрь', 'сентября' ],
    [ 'октябрь',  'октября' ],
    [ 'ноябрь',   'ноября' ],
    [ 'декабрь',  'декабря' ],
    
  ];
  /*
    nominative - Именительный падеж
    genetive - Родительный падеж
  */
  static nominative = (ind: number) => this.months[ind][0];
  static genetive   = (ind: number) => this.months[ind][1];


}

export class CountDaysOfMonth
{
  private static days = [
    31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
  ];

  static getDays = (order: number, year: number) => 
  {
    if(order === 1 && isLeapYear(year))
    {
      return 29;
    }

    return this.days[order];
  };

}

function isLeapYear(year: number) 
{
  if (year % 4 == 0) 
  {
    if (year % 100 == 0) 
    {
      return year % 400 == 0;
    }
    
    return true;
  }
  
  return false;
}

export class setDate
{
  #date: Date;
  constructor(date?: Date)
  {
    this.#date = date ? new Date(date) : new Date();
  }

  get date()
  {
    return this.#date;
  }

  setMonth(num: number)
  {
    this.#date.setMonth(num);
    
    return this;
  }

  setDay(num: number)
  {
    this.#date.setDate(num);
    
    return this;
  }
  setFirstDay()
  {
    this.#date.setDate(1);
    
    return this;
  }
  
  
  nextMonth()
  {
    const curr_month = this.#date.getMonth();
    if(curr_month === 11)
    {
      this.#date.setMonth(0);
      this.#date.setFullYear(this.#date.getFullYear() + 1);
    }
    else
    {
      this.#date.setMonth(curr_month + 1);
    }

    return this;
  }

  
  changeMonth(count: number)
  {
    let year = this.#date.getFullYear() + Math.round(count / 12);
    let curr_month = this.#date.getMonth() + (count % 12);

    if(curr_month > 12)
    {
      year += 1;
      curr_month %= 12;
    }
    else if(curr_month < 0)
    {
      year -= 1;
      curr_month = 12 + (curr_month % 12);
      curr_month = curr_month === 12? 0 : curr_month;
    }

    this.#date.setFullYear(year);
    this.#date.setMonth(curr_month);

    return this;
  }  

  setMidnight()
  {
    this.#date.setHours(0);
    this.#date.setMinutes(0);
    this.#date.setSeconds(0);
    this.date.setMilliseconds(0);

    return this;
  }
}

export class DateWithSecondPrecision extends Date
{
  constructor(date: Date | string)
  {
    date = new Date(date);

    date.setMilliseconds(0);
    super(date);
  }

  override toString()
  {
    const set_first_null = (num: number) => num < 10? `0${num}` : `${num}`;

    const seconds = set_first_null(this.getSeconds());
    const minutes = set_first_null(this.getMinutes());
    const hours = set_first_null(this.getHours());

    const date = set_first_null(this.getDate());
    const month = set_first_null(this.getMonth());
    const year = (this.getFullYear() + '').slice(2);
    
    return `${date}.${month}.${year} ${hours}:${minutes}:${seconds}`;    
  }
}

/**
 * 19.04.2024:14:35 -> 19.04.2024:00:00
 */
export class DateWithDayPrecision extends Date
{

  constructor( date: Date | string)
  {
    date = new Date(date);
    
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);    
    super(date);

  }

  /**
   * @example toString() => '04.
   */
  override toString(): string
  {
    return dd_mm_yy(this);
  }
}

const dd_mm_yy = (date: Date, separator='.') =>
{
  const with_null = (num: number) => num < 10? `0${num}` : `${num}`;

  const day = with_null(date.getDate());
  const month = with_null(date.getMonth());
  const year = (date.getFullYear() + '').slice(2);
    

  return [ day, month, year ].join(separator);
};