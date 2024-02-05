export interface ToDoItem {
  id: string; // uuid
  isDone: boolean;
  text: string;
}
export enum ToDoEvents {
  LIST = "list",
  CREATE = "create",
  CREATED = "created",
  UPDATE = "update",
  UPDATED = "updated",
  REMOVE = "remove",
  REMOVED = "removed",
}

// Events finishing with "ed" are listenable
export type ToDoListenableEvents = [
  ToDoEvents.CREATED,
  ToDoEvents.UPDATED,
  ToDoEvents.REMOVED
];
