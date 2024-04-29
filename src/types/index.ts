export interface Config {
  [key: string]: {
    corsOptions: {
      origin: string[];
      credentials: boolean;
    };
    databaseURI: string;
    port: number | string;
    apiKey: string;
    appSecret: string;
    cookieName: string;
  };
}
export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image: string;
  status: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
