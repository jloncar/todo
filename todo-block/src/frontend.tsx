import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { ToDoEvents, ToDoItem, ToDoService } from "todo-protocol";

const toDoService = new ToDoService((window as any).todo_ws_server);

const ToDoFrontendComponent = () => {
  const [todo, setToDo] = useState<ToDoItem[]>([]);

  // Load when component is mounted
  useEffect(() => {
    (async () => {
      const fetchData = async () => {
        setToDo(await toDoService.fetch());
      };

      const handleCreated = (item) => {
        setToDo((current) => [...current, item]);
      };

      const handleUpdated = (updatedItem) => {
        setToDo((current) =>
          current.map((item) =>
            item.id === updatedItem.id ? { ...item, ...updatedItem } : item,
          ),
        );
      };

      const handleRemoved = (removedItemId) => {
        setToDo((current) =>
          current.filter((item) => item.id !== removedItemId),
        );
      };

      // Fetch initial data and subscribe to CREATED and UPDATED events
      fetchData();
      toDoService.subscribe(ToDoEvents.CREATED, handleCreated);
      toDoService.subscribe(ToDoEvents.UPDATED, handleUpdated);
      toDoService.subscribe(ToDoEvents.REMOVED, handleRemoved);
    })();
  }, []);

  return (
    <div>
      <ul>
        {todo.map((todo) => (
          <li
            key={todo.id}
            style={{ textDecoration: todo.isDone ? "line-through" : "none" }}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

for (const wrapper of document.querySelectorAll(".todo-fe-wrapper")) {
  ReactDOM.render(<ToDoFrontendComponent />, wrapper);
}
