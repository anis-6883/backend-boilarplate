import logger from "../helpers/logger";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

export default class SocketManager {
  private io!: SocketIOServer;

  constructor(server: http.Server, options: { origin: string[] }) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: options.origin,
        credentials: true,
        methods: ["GET", "POST"],
      },
    });
    logger.info("=> Socket.io initialized");
  }

  get getSocket() {
    return this.io;
  }

  // listen(...middlewares: ((socket: Socket, next: (err?: Error) => void) => void)[]) {
  listen(middlewares: any[]) {
    return new Promise((resolve, reject) => {
      try {
        for (let middleware of middlewares) {
          this.io.use(middleware);
        }
        resolve(true);
        this.io.on("connection", async (ws: Socket) => {
          logger.info("Connected =>", ws.id);
          ws.on("disconnect", () => logger.info("Disconnected =>", ws.id));
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
