import { REDIS_TODOS_KEY, ToDoRepository } from "./todo.repository";

// Mock RedisClientType for testing purposes
const mockRedisClient: any = {
  hGetAll: jest.fn(),
  hSet: jest.fn(),
  hDel: jest.fn(),
};

const todoRepository = new ToDoRepository(mockRedisClient);

describe("ToDoRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("all method retrieves all ToDo items", async () => {
    const mockTodoItems: Record<string, string> = {
      todo1: JSON.stringify({ id: "todo1", text: "Task 1", isDone: false }),
      todo2: JSON.stringify({ id: "todo2", text: "Task 2", isDone: true }),
    };

    mockRedisClient.hGetAll.mockResolvedValueOnce(mockTodoItems);

    const result = await todoRepository.all();

    expect(mockRedisClient.hGetAll).toHaveBeenCalledWith(REDIS_TODOS_KEY);
    expect(result).toEqual([
      { id: "todo1", text: "Task 1", isDone: false },
      { id: "todo2", text: "Task 2", isDone: true },
    ]);
  });

  test("create method adds a ToDo item", async () => {
    const todoItem = { text: "New Task", isDone: false };

    const result = await todoRepository.create(todoItem);
    const receivedId = mockRedisClient.hSet.mock.calls[0][1];

    expect(mockRedisClient.hSet).toHaveBeenCalledWith(
      REDIS_TODOS_KEY,
      receivedId,
      JSON.stringify({
        id: receivedId,
        text: "New Task",
        isDone: false,
      })
    );
    expect(result).toEqual(expect.objectContaining(todoItem));
  });

  test("update method updates a ToDo item", async () => {
    const todoItem = { text: "Updated Task", isDone: false };
    const todoId = "todo1";

    const result = await todoRepository.update(todoId, todoItem);

    expect(mockRedisClient.hSet).toHaveBeenCalledWith(
      REDIS_TODOS_KEY,
      todoId,
      JSON.stringify({ text: "Updated Task", isDone: false, id: todoId })
    );
    expect(result).toEqual(expect.objectContaining(todoItem));
  });

  test("remove method removes a ToDo item", async () => {
    const todoId = "todo1";

    await todoRepository.remove(todoId);

    expect(mockRedisClient.hDel).toHaveBeenCalledWith(REDIS_TODOS_KEY, todoId);
  });
});
