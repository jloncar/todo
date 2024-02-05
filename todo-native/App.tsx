// App.tsx
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  ListRenderItemInfo,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { ToDoEvents, ToDoItem, ToDoService } from "todo-protocol";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const toDoService = new ToDoService("http://localhost:6900");

export default function App(): JSX.Element {
  const [newTodoText, setNewTodoText] = useState("");
  const [toDos, setToDos] = useState<ToDoItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setToDos(await toDoService.fetch());
      toDoService.subscribe(ToDoEvents.CREATED, handleCreated);
      toDoService.subscribe(ToDoEvents.UPDATED, handleUpdated);
      toDoService.subscribe(ToDoEvents.REMOVED, handleRemoved);
    };

    fetchData();
  }, []);

  const handleDelete = (id: string) => {
    toDoService.remove(id);
  };

  const handleAdd = () => {
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

  const handleCheckboxChange = (item: ToDoItem) => {
    const todoToUpdate = item;
    todoToUpdate.isDone = !todoToUpdate.isDone;
    toDoService.update(todoToUpdate.id, todoToUpdate);
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      onPress={() => handleDelete(id)}
      style={styles.deleteButton}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: ToDoItem }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.todoItem}>
        <View style={styles.checkboxContainer}>
          <BouncyCheckbox
            isChecked={item.isDone}
            onPress={() => handleCheckboxChange(item)}
          />
        </View>
        <Text style={item.isDone ? styles.strikeThroughText : null}>
          {item.text}
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>To Do List</Text>
      </View>
      <FlatList
        data={toDos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={1} // Change to 1 for full width items
      />
      <TextInput
        style={styles.input}
        placeholder="Add a new todo"
        value={newTodoText}
        onChangeText={(text) => setNewTodoText(text)}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Todo</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 64,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  todoItem: {
    flex: 1,
    flexDirection: "row", // Align checkbox and text horizontally
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    width: "100%", // Set width to full width
  },
  checkboxContainer: {
    marginRight: 16,
  },
  strikeThroughText: {
    textDecorationLine: "line-through",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 16,
    paddingHorizontal: 8,
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    marginTop: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "85%",
    borderRadius: 8,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: "#fff",
  },
});
