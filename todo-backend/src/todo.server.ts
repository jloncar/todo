import { Server, Socket } from "socket.io";
import { ToDoEvents, ToDoItem } from "todo-protocol";
import { ToDoRepository } from "./todo.repository";

export class ToDoServer {
  constructor(
    protected readonly io: Server,
    protected readonly todoRepository: ToDoRepository
  ) {
    this.io.on("connection", this.listen.bind(this));
  }

  listen(socket: Socket): void {
    // Handle incoming events
    socket.on(ToDoEvents.LIST, this.list.bind(this));
    socket.on(ToDoEvents.CREATE, this.create.bind(this));
    socket.on(ToDoEvents.UPDATE, this.update.bind(this));
    socket.on(ToDoEvents.REMOVE, this.remove.bind(this));

    // Handle errors
    socket.on("error", (error: Error) => {
      console.error("Socket error:", error);
    });
    socket.on("connect_error", (err) => {
      console.error(`connect_error due to ${err.message}`);
    });
  }

  async list(callback: Function): Promise<void> {
    callback(await this.todoRepository.all());
  }

  async create(toDoItem: Omit<ToDoItem, "id">): Promise<void> {
    const todo = await this.todoRepository.create(toDoItem);
    this.io.emit(ToDoEvents.CREATED, todo);
    console.log("Emitted created for ", todo);
  }

  async update(id: string, toDoItem: Omit<ToDoItem, "id">): Promise<void> {
    const todo = await this.todoRepository.update(id, toDoItem);
    this.io.emit(ToDoEvents.UPDATED, todo);
  }

  async remove(id: string): Promise<void> {
    void this.todoRepository.remove(id);
    this.io.emit(ToDoEvents.REMOVED, id);
  }
}
