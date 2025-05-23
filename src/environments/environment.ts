// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export enum environments {
  dev = 1, test = 2, pre = 3, pro = 4
};

export const environment = {
  production: false,
  whereIAm: environments.pro,
  // whereIAm: environments.pre,
  // apiUrl: "http://localhost:5002/api"
  // apiUrl: "https://osteuslivrosnodejs-production.up.railway.app/api"
  apiUrl: "https://osteuslivrosnodejs.onrender.com/api"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
