
export enum environments {
  dev = 1, test = 2, pre = 3, pro = 4
};

export const environment = {
  whereIAm: environments.pro,
  apiUrl: "https://osteuslivrosnodejs.onrender.com/api"
};
