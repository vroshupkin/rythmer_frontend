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
