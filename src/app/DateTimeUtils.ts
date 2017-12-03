export class DateTimeUtils {

  public static getDateFromEpochSeconds(epochSeconds: number) {
    return new Date(epochSeconds * 1000)
  }
}
