import { readFileSync } from "fs";
import app from "./configs/server";
import http from "http";
import http2 from "https";
import path from "path";
import logger from "./helpers/logger";
import SocketManager from "./controller/socket";
import config from "./configs/config";
import { socketAuth } from "./middlewares/socketAuth";
import MailService from "./controller/mail";
import S3Utils from "./controller/bucket";
import SearchCtrl from "./controller/search/search";
import RedisUtils from "./controller/redis";
import ServiceLocator from "./controller/serviceLocator";
import gracefulShutdown from "./controller/gracefullShutdown";

(async () => {
  try {
    const PORT = process.env.PORT || 8080;
    const env = process.env.NODE_ENV || "development";
    const wsMiddlewares = [socketAuth];
    let server: http.Server;
    if (env === "development") server = http.createServer(app);
    else {
      const options = {
        key: readFileSync(path.join(process.cwd(), "ssl", "privatekey.pem")), // paths can varry depending on environment
        cert: readFileSync(path.join(process.cwd(), "ssl", "certificate.pem")), // paths can varry depending on environment
        allowHTTP1: true,
        protocols: ["h2", "http/1.1"],
      };
      server = http2.createServer(options, app);
    }

    const socket = new SocketManager(server, config[env].corsOptions);
    await socket.listen(wsMiddlewares);

    const mailer = new MailService();
    mailer.createConnection();

    const aws = new S3Utils(config[env].s3Options);

    // const search = new SearchCtrl();
    // await search.start();

    const redis = new RedisUtils();

    // services push
    ServiceLocator.registerService("mailer", mailer);
    ServiceLocator.registerService("aws", aws);
    ServiceLocator.registerService("redis", redis);
    ServiceLocator.registerService("socket", socket.getSocket);
    // ServiceLocator.registerService("search", search);
    // services.forEach((service) => ServiceLocator.registerService(service));

    server.listen(PORT, () => {
      logger.info(`=> Server listening on port ${PORT}`);
    });

    gracefulShutdown();
  } catch (error: any) {
    logger.error("Error starting the server:", error.message);
  }
})();
