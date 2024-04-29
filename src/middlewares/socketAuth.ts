import { decodeAuthToken } from "../helpers";
import { Socket } from "socket.io";
import { COOKIE_KEY } from "../configs/constants";

interface SocketExtended extends Socket {
  user: any;
}

/**
 * This function is the middleware of socket auth.
 */
export async function socketAuth(socket: SocketExtended, next: (err?: Error) => void): Promise<void> {
  try {
    const token =
      (socket.handshake?.headers?.cookie || "")
        ?.split(";")
        ?.find((s: string) => s.includes(`${COOKIE_KEY}=`))
        ?.replace(`${COOKIE_KEY}=`, "")
        ?.replace(/\s/g, "") || (socket.handshake?.headers?.[`${COOKIE_KEY}`] as string)?.replace("Bearer ", "");
    if (!token) return next();
    const user = await decodeAuthToken(token);
    if (!user) throw new Error("Unauthorized");
    socket.user = user;
    socket.join(user.id);
    // socket.join(user.role);
    next();
  } catch (e) {
    console.log(e);
    next(new Error("Unauthorized"));
  }
}
