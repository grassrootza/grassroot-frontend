export class DateTimeUtils {

  public static getDateFromJavaInstant(instant) {
    return new Date(instant.epochSecond * 1000)
  }

  public static convertDateStringToEpochMilli(dateString: string) {
    let date = new Date(dateString);
    return date.getTime();
  }
}
