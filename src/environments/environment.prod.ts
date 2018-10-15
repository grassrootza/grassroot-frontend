export const environment = {
  production: true,
  backendAppUrl: "https://app.grassroot.org.za/v2",
  frontendAppUrl: "https://www.grassroot.org.za",
  ussdPrefix: `*134*1994*`,
  groupShortCode: '31660',
  recaptchaPublicKey: '6LegYE0UAAAAAFrs_Mf8-_1YD6pLC-wps4W__96p',
  
  // some lambda endpoints
  recaptchaVerifyUrl: 'https://p21elfj42g.execute-api.eu-west-1.amazonaws.com/latest/validate_captcha',
  mediaFetchUrl: 'https://6waduader0.execute-api.eu-west-1.amazonaws.com/latest',
  s3publicUrl: 'https://s3-eu-west-1.amazonaws.com/',

  memberFetchCutOff: 100 // i.e., size of group above which we stop doing this like fetching all on modals
};
