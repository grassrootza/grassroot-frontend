import {NgbDateTimeStruct} from "@zhaber/ng-bootstrap-datetimepicker";

export class DateTimeUtils {

  public static getDateFromJavaInstant(instant) {
    return new Date(instant.epochSecond * 1000)
  }

  public static convertDateStringToEpochMilli(dateString: string) {
    let date = new Date(dateString);
    return date.getTime();
  }

  public static fromDate(date): NgbDateTimeStruct {
    if (date) {
      return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds()};
    } else {
      return date;
    }
  }

  public static fromNgbStruct(dateTime: NgbDateTimeStruct): number {
    return new Date(dateTime.year,
      dateTime.month-1,
      dateTime.day,
      dateTime.hour,
      dateTime.minute,
      dateTime.second).getTime();
  }
}
