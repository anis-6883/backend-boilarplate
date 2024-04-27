import { readFileSync } from "fs";
import app from "./configs/server";
import http from "http";
import http2 from "https";
import path from "path";
import logger from "helpers/logger";

const startServer = async () => {
  try {
    const PORT = process.env.PORT || 8080;
    let server: http.Server;
    if (process.env.NODE_ENV === "development") server = http.createServer(app);
    else {
      const options = {
        key: readFileSync(path.join(process.cwd(), "ssl", "privatekey.pem")), // paths can varry depending on environment
        cert: readFileSync(path.join(process.cwd(), "ssl", "certificate.pem")), // paths can varry depending on environment
        allowHTTP1: true,
        protocols: ["h2", "http/1.1"],
      };
      server = http2.createServer(options, app);
    }
    server.listen(PORT, () => {
      logger.info(`=> Server listening on port ${PORT}`);
    });
  } catch (error: any) {
    console.error("Error starting the server:", error.message);
    process.exit(1);
  }
};

startServer();
