import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment-mini-ts';
import {Moment} from 'moment-mini-ts';
import {FormGroup} from "@angular/forms";

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

  public static futureTimeStruct(minutesToAdd: number = 0, hoursToaAdd: number = 0) {
    let date = moment().add(minutesToAdd, 'minutes').add(hoursToaAdd, 'hours');
    console.log("altered date: ", date);
    return { hour: date.hour(), minute: date.minutes() }
  }

  public static momentFromNgbStruct(date: NgbDateStruct, time?: NgbTimeStruct): Moment {
    return moment(
      [
        date.year,
        date.month - 1,
        date.day,
        time ? time.hour : 12,
        time ? time.minute : 0,
        time ? time.second : 0,
        0
      ]
    )
  }
}

export const epochMillisFromDateTime = (ngbDate: NgbDateStruct, ngbTime: NgbTimeStruct) => {
  return DateTimeUtils.momentFromNgbStruct(ngbDate, ngbTime).valueOf();
}

export const epochMillisFromDate = (ngbDate: NgbDateStruct) => {
  return DateTimeUtils.momentFromNgbStruct(ngbDate).valueOf();
};

export const ngbDateFromMoment = (date: Moment): NgbDateStruct => {
  return { year: date.year(), month: date.month() + 1, day: date.date() }
};

export const isDateTimeFuture = (dateFieldName: string = "date", timeFieldName: string = "time") => {
  return (form: FormGroup) => {
    // console.log('triggered date time future validator, time field name = ', timeFieldName);
    let date = form.get(dateFieldName);
    let time = form.get(timeFieldName);

    if (date && time) {
      let derivedMoment = DateTimeUtils.momentFromNgbStruct(date.value, time.value);
      // console.log('derived moment of date-time: ', derivedMoment);
      // console.log('current moment? : ', moment());
      // console.log('and is it after: ', derivedMoment.isAfter(moment()));
      return derivedMoment.isAfter(moment()) ? null : { dateTimePast: true };
    }

    return null;
  }
};
