export enum environments {
  dev = 1, test = 2, pre = 3, pro = 4
};

export const environment = {
  production: false,
  whereIAm: environments.pro,
  // whereIAm: environments.pre,
  //apiUrl: "http://localhost:5002/api"
  apiUrl: "https://osteuslivrosnodejs-production.up.railway.app/api"
};
