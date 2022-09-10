import {CountryCode, format, isValidNumber, parse, formatNumber} from "libphonenumber-js";

// note: we use this much more in code than in templates, hence doing as static methods instead of pipe
export class PhoneNumberUtils {

  public static convertToSystem(phone: string, country: CountryCode = 'ZA'): string {
    if (!phone) {
      return phone;
    }
    const parsed = parse(phone, country);
    const result = formatNumber(parsed, 'E.164');
    return result.substring(1);
  }

  public static convertFromSystem(phone: string, country: CountryCode = 'ZA') {
    if (!phone) {
      return phone;
    }
    let parsed = parse('+' + phone, country);
    let result = format(parsed, 'NATIONAL');
    // in case it didn't work, rather than undefined, pass back what we got
    if (result) {
      return result;
    }
    return phone;
  }

  public static convertIfPhone(username: string): string {
    if (username && isValidNumber(username, "ZA")) {
      username = PhoneNumberUtils.convertToSystem(username);
    }
    return username;
  }
}
