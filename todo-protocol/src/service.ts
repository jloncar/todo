import { Socket, io } from "socket.io-client";
import { ToDoEvents, ToDoItem, ToDoListenableEvents } from "./types";

export class ToDoService {
  protected io: Socket;

  protected listeners: Map<ToDoListenableEvents[number], Function[]> =
    new Map();

  constructor(endpoint: string, ioClient?: Socket) {
    this.io = ioClient ?? io(endpoint);
    this.io.onAny((event, args) => {
      if (this.listeners.has(event)) {
        for (const callback of this.listeners.get(event)) {
          callback(args);
        }
      }
    });
  }

  subscribe(event: ToDoListenableEvents[number], callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [callback]);
    } else {
      this.listeners.get(event).push(callback);
    }
  }

  fetch(): Promise<ToDoItem[]> {
    return new Promise<ToDoItem[]>((resolve, reject) => {
      try {
        this.io.emit(ToDoEvents.LIST, (response: ToDoItem[]) =>
          resolve(response)
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  create(toDoItem: Omit<ToDoItem, "id">): void {
    this.io.emit(ToDoEvents.CREATE, toDoItem);
  }

  update(id: string, toDoItem: Omit<ToDoItem, "id">): void {
    console.log("updated", id, toDoItem);
    this.io.emit(ToDoEvents.UPDATE, id, toDoItem);
  }

  remove(id: string): void {
    this.io.emit(ToDoEvents.REMOVE, id);
  }
}
