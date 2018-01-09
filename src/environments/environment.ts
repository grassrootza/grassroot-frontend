// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // backendAppUrl: "https://staging.grassroot.org.za",
  backendAppUrl: "http://localhost:8080",
  frontendAppUrl: "http://alpha.grassroot.cloud/join/", // leave as this for testing (bitly doesn't like localhost)
  ussdPrefix: `*134*1994*`,
  groupShortCode: '31660'
};
