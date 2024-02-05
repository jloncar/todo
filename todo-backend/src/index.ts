import { Server as SocketIoServer } from "socket.io";
import * as redis from "redis";
import { ToDoRepository } from "./todo.repository";
import { ToDoServer } from "./todo.server";

(async () => {
  const redisClient: redis.RedisClientType = redis.createClient();

  await redisClient.connect();

  new ToDoServer(
    new SocketIoServer(Number(process.env.PORT) || 6900, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    }),
    new ToDoRepository(redisClient)
  );

  console.log("ToDo backend server is running...");
})();
