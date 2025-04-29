export enum environments {
  dev = 1, test = 2, pre = 3, pro = 4
};

export const environment = {
  production: true,
  whereIAm: environments.pro,
  // whereIAm: environments.pre,
  // apiUrl: "http://localhost:5002/api"
  // apiUrl: "https://osteuslivrosnodejs-production.up.railway.app/api"
  apiUrl: "https://osteuslivrosnodejs.onrender.com/api"
};
