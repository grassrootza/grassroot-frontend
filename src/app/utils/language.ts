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

export const findByTwoDigitCode = (code: string, defaultLang?: Language): Language => {
  if (!code)
    return defaultLang ? defaultLang : undefined;
  const index = MSG_LANGUAGES.findIndex(lang => lang.twoDigitCode == code);
  console.log('index of language: ', index);
  console.log('returning: ', MSG_LANGUAGES[index]);
  return index != -1 ? MSG_LANGUAGES[index] : (defaultLang ? defaultLang : undefined); 
}
