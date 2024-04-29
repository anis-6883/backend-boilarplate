import { Logger } from "tslog";
import { createStream } from "rotating-file-stream";

const stream = createStream("backend-server.log", {
  size: "10M",
  interval: "1d",
  compress: "gzip",
});

const logger = new Logger({
  name: "Backend-Server",
  type: "pretty",
  prettyLogTimeZone: "local",
  minLevel: 0,
  attachedTransports: [
    (logObj) => {
      stream.write(JSON.stringify(logObj) + "\n");
    },
  ],
});

export default logger;
