export class DateTimeUtils {

  public static getDateFromJavaInstant(instant) {
    return new Date(instant.epochSecond * 1000)
  }
}
