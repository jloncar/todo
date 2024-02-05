import type { RedisClientType } from "redis";
import { ToDoItem } from "todo-protocol";

export const REDIS_TODOS_KEY = "todos";

export class ToDoRepository {
  constructor(protected readonly redisClient: RedisClientType) {}

  async all(): Promise<ToDoItem[]> {
    // Retrieve all ToDo items from the Redis Hash
    const todoItems = await this.redisClient.hGetAll(REDIS_TODOS_KEY);

    // Parse the values of the Hash into ToDoItem objects
    return Object.values(todoItems).map((item) => JSON.parse(item));
  }

  async create(todoItem: Omit<ToDoItem, "id">): Promise<ToDoItem> {
    const id = generateUUID();

    // Add the ToDoItem to the Redis Hash
    await this.redisClient.hSet(
      REDIS_TODOS_KEY,
      id,
      JSON.stringify({
        id,
        text: todoItem.text,
        isDone: false,
      })
    );

    return { ...todoItem, id };
  }

  async update(id: string, todoItem: Omit<ToDoItem, "id">): Promise<ToDoItem> {
    await this.redisClient.hSet(
      REDIS_TODOS_KEY,
      id,
      JSON.stringify({ ...todoItem, id: id })
    );

    return { ...todoItem, id };
  }

  async remove(id: string): Promise<void> {
    void this.redisClient.hDel(REDIS_TODOS_KEY, id);
  }
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
