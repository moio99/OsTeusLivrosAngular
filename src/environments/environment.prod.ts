
export enum environments {
  dev = 1, test = 2, pre = 3, pro = 4
};

export const environment = {
  whereIAm: environments.pro,
  portoJava: "8080",
  apiUrl: "https://osteuslivrosnodejs.onrender.com/api"
};
