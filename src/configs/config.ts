import { Config } from "types";
import { MIME_TYPE } from "./constants";

const config: Config = {
  development: {
    corsOptions: {
      origin: process.env.CORS_ORIGINS!.split(",").map((origin) => origin.trim()),
      credentials: true,
    },
    databaseURI: process.env.DEV_DATABASE_URL!,
    port: process.env.PORT || 8000,
    apiKey: process.env.API_KEY!,
    appSecret: process.env.APP_SECRET!,
    cookieName: "secret",
    useHTTP2: false,
    s3Options: {
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      region: process.env.AWS_REGIION!,
      directory: process.env.AWS_BUCKET_DIRECTORY_NAME!,
      mimeTypes: MIME_TYPE,
      maxSize: 10240000,
    },
  },
  production: {
    corsOptions: {
      origin: process.env.CORS_ORIGINS!.split(",").map((origin) => origin.trim()),
      credentials: true,
    },
    databaseURI: process.env.PROD_DATABASE_URL!,
    port: process.env.PORT || 8000,
    apiKey: process.env.API_KEY!,
    appSecret: process.env.APP_SECRET!,
    cookieName: "secret",
    useHTTP2: true,
    s3Options: {
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      region: process.env.AWS_REGIION!,
      directory: process.env.AWS_BUCKET_DIRECTORY_NAME!,
      mimeTypes: MIME_TYPE,
      maxSize: 10240000,
    },
  },
};

export default config;
