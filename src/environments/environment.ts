// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'http://gama.ku/cloudcare/api/auth/public/',
  // apiUrl: "http://staging.demosistem.my.id:1012/public/",
  apiUrl: "https://cloudcare-api-auth.stagingsistem.my.id/",
  // apiUrl: "http://172.17.0.1:22211",
  PORT: 3000,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
