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