import React from "react";
import { registerBlockType } from "@wordpress/blocks";
import {
  Button,
  CheckboxControl,
  Flex,
  FlexBlock,
  FlexItem,
  IconButton,
  TextControl,
} from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import { BlockAttributes, BlockEditProps, BlockSaveProps } from "./types";
import { ToDoEvents, ToDoItem, ToDoService } from "todo-protocol";
import { useBlockProps, RichText } from "@wordpress/block-editor";

const toDoService = new ToDoService("http://localhost:6900");

const ToDoBlockEdit: React.FC<BlockEditProps> = (props) => {
  const blockProps = useBlockProps();
  const { attributes, setAttributes } = props;
  const [newTodoText, setNewTodoText] = useState("");
  const [toDos, setToDos] = useState<ToDoItem[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleCheckboxChange = (index: number) => {
    const todoToUpdate = toDos[index];
    todoToUpdate.isDone = !todoToUpdate.isDone;
    toDoService.update(todoToUpdate.id, todoToUpdate);
    // No need to update via setState, leave that to "UPDATED" subscription
  };
  const handleDeleteClick = (index: number) => {
    toDoService.remove(toDos[index].id);
  };

  const handleAddClick = () => {
    toDoService.create({ text: newTodoText, isDone: false });
    setNewTodoText("");
  };

  const handleCreated = (createdItem: ToDoItem) => {
    setToDos((prev) => [...prev, createdItem]);
  };

  const handleUpdated = (updatedItem: ToDoItem) => {
    setToDos((prev) => [
      ...prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    ]);
  };

  const handleRemoved = (removedItemId: string) => {
    setToDos((prev) => [...prev.filter((item) => item.id !== removedItemId)]);
  };

  // Load when component is mounted
  useEffect(() => {
    (async () => {
      setToDos(await toDoService.fetch());

      // Subscribe to CREATED event
      toDoService.subscribe(ToDoEvents.CREATED, handleCreated);

      // Subscribe to UPDATED event
      toDoService.subscribe(ToDoEvents.UPDATED, handleUpdated);

      // Subscribe to REMOVED event
      toDoService.subscribe(ToDoEvents.REMOVED, handleRemoved);
    })();
  }, []);

  return (
    <div {...blockProps}>
      <RichText
        tagName="h2"
        value={attributes.heading}
        allowedFormats={["core/bold", "core/italic"]}
        onChange={(heading) => setAttributes({ heading })}
        placeholder="To Do heading..."
      />

      {toDos.map((todo, index) => (
        <Flex
          key={index}
          gap={2}
          align="center"
          justify="space-between"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <FlexBlock>
            <CheckboxControl
              label={todo.text}
              checked={todo.isDone}
              onChange={() => handleCheckboxChange(index)}
            />
          </FlexBlock>
          <FlexItem>
            <Button
              icon={"trash"}
              label="Delete"
              onClick={() => handleDeleteClick(index)}
              style={{
                visibility: hoveredIndex === index ? "visible" : "hidden",
              }}
            />
          </FlexItem>
        </Flex>
      ))}
      <Flex gap={2}>
        <FlexBlock>
          <TextControl
            value={newTodoText}
            onChange={(value) => setNewTodoText(value)}
          />
        </FlexBlock>
        <FlexItem>
          <Button
            onClick={handleAddClick}
            disabled={newTodoText === ""}
            icon={"plus"}
            style={{ paddingBottom: "16px" }}
          >
            Add
          </Button>
        </FlexItem>
      </Flex>
    </div>
  );
};

const ToDoBlockSave: React.FC<BlockSaveProps> = ({ attributes }) => (
  <div {...useBlockProps.save()}>
    <RichText.Content tagName="h2" value={attributes.heading} />
    <div className="todo-fe-wrapper" />
  </div>
);

registerBlockType<BlockAttributes>("todo-block/my-block", {
  title: "ToDo Block",
  icon: "smiley",
  category: "common",
  attributes: {
    heading: {
      type: "string",
      source: "html",
      selector: "h2",
      default: "To Do",
    },
  },
  edit: ToDoBlockEdit,
  save: ToDoBlockSave,
});
