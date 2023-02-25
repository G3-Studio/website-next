import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
//   const session = await getServerSession(req, res, authOptions);
//   if (session) {
    // Signed in
    if (res.socket && (res.socket as any).server.io) {
      // console.log('test2');
    } else {
      const io = new Server((res.socket as any).server);
      (res.socket as any).server.io = io;
      
      io.on('connection', socket => {
        // Listening for a connection
        console.log('Connected');

        socket.on('join-workshop', (id) => {
          // leave all rooms
          Object.keys(socket.rooms).forEach(room => {
            socket.leave(room);
          });

          socket.join(id.toString());
        });

        socket.on('workshop-delete-send', (data) => {
          // send to all clients in room except sender
          socket.to(data.roomId.toString()).emit('workshop-delete', data);

          // TODO: save to database
        });

        socket.on('workshop-modify-send', (data) => {
          // send to all clients in room except sender
          socket.to(data.roomId.toString()).emit('workshop-modify', data);

          // TODO: save to database
        });

        socket.on('workshop-add-send', (data) => {
          // send to all clients in room except sender
          socket.to(data.roomId.toString()).emit('workshop-add', data);

          // TODO: save to database
        });

        socket.on('workshop-move-send', (data) => {
          // send to all clients in room except sender
          socket.to(data.roomId.toString()).emit('workshop-move', data);

          // TODO: save to database
        });
      });

      io.on('disconnect', socket => {
        // Listening for a disconnect
        console.log('Disconnected');
      }
      );
    }
//   } else {
//     // Not Signed in
//     res.status(401);
//   }
  res.end();
}