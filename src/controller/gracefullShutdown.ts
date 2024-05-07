import { existsSync, mkdirSync } from "fs";
import path from "path";
import ServiceLocator from "./serviceLocator";

const eventsToHandle: string[] = ["SIGTERM", "SIGINT", "unhandledRejection", "uncaughtException", "SIGUSR2"];

const cachePath = path.join(process.cwd(), ".cache");
if (!existsSync(cachePath)) mkdirSync(cachePath);

export default function gracefulShutdown(): void {
  eventsToHandle.forEach(async (e) =>
    process.on(e, async (orgErr) => {
      try {
        console.log(orgErr);
        const searchCtrl = ServiceLocator.getService("search");
        searchCtrl.saveData().catch((er: any) => console.log(er));
      } catch (err) {
        console.log(err);
        return process.exit();
      }
    })
  );
}
