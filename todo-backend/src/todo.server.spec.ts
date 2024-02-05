import { Server, Socket } from "socket.io";
import { ToDoEvents, ToDoItem } from "todo-protocol";
import { ToDoServer } from "./todo.server";
import { ToDoRepository } from "./todo.repository";

// Mocking Server and Socket
jest.mock("socket.io");

// Mocking ToDoRepository
jest.mock("./todo.repository");

describe("ToDoServer", () => {
  let mockIo: Server;
  let mockSocket: Socket;
  let mockToDoRepository: ToDoRepository;
  let toDoServer: ToDoServer;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock instances
    mockIo = new Server();
    mockSocket = new Socket(mockIo as any, null as any, null as any);
    mockToDoRepository = new ToDoRepository(null as any); // Replace with a valid RedisClientType mock

    // Create ToDoServer instance
    toDoServer = new ToDoServer(mockIo, mockToDoRepository);
  });

  test("should handle create event and emit CREATED event", async () => {
    const mockToDoItem: Omit<ToDoItem, "id"> = {
      text: "New Task",
      isDone: false,
    };
    const mockCreatedTodo: ToDoItem = {
      ...mockToDoItem,
      id: "generated-id",
      isDone: false,
    };

    jest
      .spyOn(mockToDoRepository, "create")
      .mockResolvedValueOnce(mockCreatedTodo);
    const emitSpy = jest.spyOn(mockIo, "emit");

    // Trigger CREATE event
    await toDoServer.create(mockToDoItem);

    expect(emitSpy).toHaveBeenCalledWith(ToDoEvents.CREATED, mockCreatedTodo);
  });

  test("should handle update event and emit UPDATED event", async () => {
    const mockId = "existing-id";
    const mockToDoItem: Omit<ToDoItem, "id"> = {
      text: "Updated Task",
      isDone: false,
    };
    const mockUpdatedTodo: ToDoItem = {
      ...mockToDoItem,
      id: mockId,
      isDone: false,
    };

    jest
      .spyOn(mockToDoRepository, "update")
      .mockResolvedValueOnce(mockUpdatedTodo);
    const emitSpy = jest.spyOn(mockIo, "emit");

    // Trigger UPDATE event
    await toDoServer.update(mockId, mockToDoItem);

    expect(emitSpy).toHaveBeenCalledWith(ToDoEvents.UPDATED, mockUpdatedTodo);
  });

  test("should handle remove event and emit REMOVED event", async () => {
    const mockId = "existing-id";
    const emitSpy = jest.spyOn(mockIo, "emit");

    // Trigger REMOVE event
    await toDoServer.remove(mockId);

    expect(emitSpy).toHaveBeenCalledWith(ToDoEvents.REMOVED, mockId);
  });
});
