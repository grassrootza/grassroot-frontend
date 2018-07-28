// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // backendAppUrl: "http://localhost:8080/v2",
  backendAppUrl: "https://staging.grassroot.org.za/v2",
  // frontendAppUrl: "http://www.grassroot.org.za", // leave as this for testing (bitly doesn't like localhost)
  frontendAppUrl: "http://localhost:4200",
  ussdPrefix: `*134*1994*`,
  groupShortCode: '31660',

  recaptchaPublicKey: '6LegYE0UAAAAAFrs_Mf8-_1YD6pLC-wps4W__96p',

  // some lambda endpoints
  recaptchaVerifyUrl: 'https://p21elfj42g.execute-api.eu-west-1.amazonaws.com/latest/validate_captcha',
  mediaFetchUrl: 'https://6waduader0.execute-api.eu-west-1.amazonaws.com/latest'
};
