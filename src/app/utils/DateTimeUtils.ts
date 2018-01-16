import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

export class DateTimeUtils {

  public static getDateFromJavaInstant(instant) {
    return new Date(instant.epochSecond * 1000)
  }

  public static convertDateStringToEpochMilli(dateString: string) {
    let date = new Date(dateString);
    return date.getTime();
  }

  public static dateFromDate(date): NgbDateStruct {
    if (date) {
      return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    } else {
      return date;
    }
  }

  public static timeFromDate(date): NgbTimeStruct {
    if (date) {
      return {hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds()};
    } else {
      return date;
    }
  }

  public static fromNgbStruct(date: NgbDateStruct, time: NgbTimeStruct): number {
    return new Date(date.year,
      date.month-1,
      date.day,
      time.hour,
      time.minute,
      time.second).getTime();
  }
}
