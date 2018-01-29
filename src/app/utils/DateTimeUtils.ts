import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import * as moment from "moment";

export class DateTimeUtils {


  public static parseDate(dateValue): Date {
    if (dateValue != null) {
      if (dateValue instanceof Date)
        return dateValue;
      else if (typeof dateValue == "string")
        return new Date(dateValue);
      else
        return DateTimeUtils.getDateFromJavaInstant(dateValue)
    }
    else return null;
  }

  public static getDateFromJavaInstant(instant): Date {
    return new Date(instant.epochSecond * 1000)
  }

  public static getMomentFromJavaInstant(instant): any {
    return moment.unix(instant.epochSecond);
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

  public static nowAsDateStruct(): NgbDateStruct {
    return { year: moment().year(), month: moment().month() + 1, day: moment().date() };
  }

  public static futureDateStruct(monthsToAdd: number, daysToAdd: number): NgbDateStruct {
    let date = moment().add(monthsToAdd, 'months').add(daysToAdd, 'days');
    return { year: date.year(), month: date.month() + 1, day: date.date() };
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

export const epochMillisFromDate = (ngbDate: NgbDateStruct) => {
  return moment(ngbDate).valueOf()
};
