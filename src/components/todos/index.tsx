import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  ActionIcon,
  Button,
  Group,
  Paper,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import {
  IconArrowsSort,
  IconCheck,
  IconPencil,
  IconPoint,
  IconTrash,
} from "@tabler/icons";

import { database } from "../../../firebase";
import Notifier from "../notifier";
import Loader from "../loader";
import { compareValues } from "@/helper/compareValues";

const dbInstance = collection(database, "todos");

const Todos = () => {
  const [todos, setTodos] = useState<any>([]);
  const [todoForm, setTodoForm] = useState({
    id: "",
    title: "",
    description: "",
    status: false,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    status: boolean;
    description: string;
  }>({
    status: false,
    description: "",
  });

  const hasSelected = (id: string) => (id?.length <= 0 ? false : true);

  const getTodos = async () => {
    const { docs } = await getDocs(dbInstance);
    setTodos(
      docs.map((item) => {
        return { ...item.data(), id: item.id };
      })
    );
  };

  const addTodo = async () => {
    await addDoc(dbInstance, {
      title: todoForm.title,
      description: todoForm.description,
    });
  };

  const updateTodo = async (id: string) => {
    const docId = doc(database, "todos", id);
    await updateDoc(docId, {
      title: todoForm.title,
      description: todoForm.description,
    });
  };

  const updateStatus = async (id: string, status: boolean) => {
    const docId = doc(database, "todos", id);
    await updateDoc(docId, {
      status: !status,
    });
  };

  const deleteTodo = async (id: string) => {
    const docId = doc(database, "todos", id);
    await deleteDoc(docId);
  };

  const handleChange = (
    event:
      | React.FormEvent<HTMLInputElement>
      | React.FormEvent<HTMLTextAreaElement>,
    name: string
  ) => {
    const value = event.currentTarget.value;
    setTodoForm({
      ...todoForm,
      [name]: value,
    });
  };

  const clearForm = () => {
    setTodoForm({ id: "", title: "", description: "", status: false });
  };

  const handleUpdateStatus = async (id: string, status: boolean) => {
    setIsLoading(true);
    await updateStatus(id, status);
    await getTodos();
    setIsLoading(false);
    setNotification({ status: true, description: "Task update successfully" });

    const notify = setTimeout(() => {
      setNotification({ status: false, description: "" });
    }, 3000);
    return () => clearTimeout(notify);
  };

  const handleSave = async (id: string) => {
    setIsLoading(true);
    if (!id) {
      await addTodo();
    } else {
      await updateTodo(id);
    }

    clearForm();
    await getTodos();
    setIsLoading(false);
    setNotification({ status: true, description: "Task save successfully" });

    const notify = setTimeout(() => {
      setNotification({ status: false, description: "" });
    }, 3000);
    return () => clearTimeout(notify);
  };

  const handleSelect = async (
    id: string,
    data: { id: string; title: string; description: string; status: boolean }
  ) => {
    const { title, description } = data;
    if (id.length <= 0) {
      return false;
    }
    setTodoForm({
      ...data,
      title,
      description,
    });
  };

  const handleDeselect = () => {
    setTodoForm({
      id: "",
      title: "",
      description: "",
      status: false,
    });
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    await deleteTodo(id);
    await getTodos();
    setIsLoading(false);
    setNotification({ status: true, description: "Task delete successfully" });

    const notify = setTimeout(() => {
      setNotification({ status: false, description: "" });
    }, 3000);
    return () => clearTimeout(notify);
  };

  const handleToggleSort = () => {
    setSortBy(!sortBy);
    const sorted = sortBy
      ? todos.sort(compareValues("title"))
      : todos.sort(compareValues("title", "desc"));

    setTodos([...sorted]);
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <>
      <Notifier
        isShow={notification.status}
        description={notification.description}
      />
      {isLoading && <Loader isLoading={isLoading} />}
      <section className="todo-area">
        <Title style={{ textAlign: "center" }} order={1}>
          TODO
        </Title>
        <TextInput
          mb={5}
          label="Title"
          onChange={(event) => handleChange(event, "title")}
          value={todoForm.title}
        />
        <Textarea
          mb={5}
          placeholder="Description"
          onChange={(event) => handleChange(event, "description")}
          value={todoForm.description}
        />
        <div
          style={{
            display: "flex",
            justifyContent: hasSelected(todoForm.id) ? "space-between" : "end",
            marginBottom: "50px",
          }}
        >
          {hasSelected(todoForm.id) ? (
            <Button variant="white" onClick={() => handleDeselect()}>
              Deselect
            </Button>
          ) : null}
          <Button variant="filled" onClick={() => handleSave(todoForm.id)}>
            Save
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "end",
            marginBottom: "20px",
          }}
        >
          <ActionIcon onClick={() => handleToggleSort()}>
            <IconArrowsSort size={30} stroke={1.5} />
          </ActionIcon>
        </div>
        {todos.map(
          (todo: {
            id: string;
            title: string;
            description: string;
            status: boolean;
          }) => (
            <Paper
              mb={3}
              bg={todoForm.id === todo.id ? "#a0caef" : "#fff"}
              shadow="xs"
              p="md"
              key={todo.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Group
                spacing="sm"
                onClick={() => handleUpdateStatus(todo.id, todo.status)}
                style={{
                  cursor: "pointer",
                }}
              >
                {todo.status ? (
                  <IconCheck color="green" size={24} stroke={1.5} />
                ) : (
                  <IconPoint color="grey" size={24} stroke={1.5} />
                )}

                <Text size="sm" weight={500} strikethrough={todo.status}>
                  {todo.title}
                </Text>
                <Text size="sm" color="dimmed" strikethrough={todo.status}>
                  {todo.description}
                </Text>
              </Group>
              <Group spacing={0} position="right">
                <ActionIcon onClick={() => handleSelect(todo.id, todo)}>
                  <IconPencil size={16} stroke={1.5} />
                </ActionIcon>
                <ActionIcon color="red" onClick={() => handleDelete(todo.id)}>
                  <IconTrash size={16} stroke={1.5} />
                </ActionIcon>
              </Group>
            </Paper>
          )
        )}
      </section>
    </>
  );
};

export default Todos;
