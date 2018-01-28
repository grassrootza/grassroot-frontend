export class Language {

  constructor(
    public twoDigitCode: string,
    public threeDigitCode: string,
    public shortName: string,
    public fullName: string) {

  }

}

export const ENGLISH = new Language("en", "eng", "Eng", "English");
export const ZULU = new Language("zu", "zul", "Zulu", "isiZulu");
export const XHOSA = new Language("xh", "xho", "Xhosa", "isiXhosa");
export const SOTHO = new Language("st", "sot", "Sotho", "Sesotho");
export const AFRIKAANS = new Language("af", "afr", "Afr", "Afrikaans");

export const MSG_LANGUAGES = [ENGLISH, ZULU, XHOSA, SOTHO, AFRIKAANS];
