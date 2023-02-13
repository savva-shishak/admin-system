import { httpServer } from ".";
import { Server as WebsocketServer } from 'socket.io';


export const io = new WebsocketServer(httpServer, { cors: { origin: '*' } });
