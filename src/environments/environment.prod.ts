export const environment = {
  production: true,
  // backendAppUrl: "https://app.grassroot.org.za",
  backendAppUrl: "http://localhost:8080",
  frontendAppUrl: "https://alpha.grassroot.cloud",
  ussdPrefix: `*134*1994*`,
  groupShortCode: '31660',
  recaptchaPublicKey: '6LegYE0UAAAAAFrs_Mf8-_1YD6pLC-wps4W__96p',

  // some lambda endpoints
  recaptchaVerifyUrl: 'https://p21elfj42g.execute-api.eu-west-1.amazonaws.com/latest/validate_captcha',
  mediaFetchUrl: 'https://6waduader0.execute-api.eu-west-1.amazonaws.com/latest'

};
