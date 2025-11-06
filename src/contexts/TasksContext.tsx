import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { Task, TaskStatus } from "../types";

interface TasksContextType {
  tasks: Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  addTask: (title: string) => void;
  moveTask: (taskId: string, direction: "left" | "right") => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

const initialTasks: Task[] = [
  { id: "1", title: "Mow The Lawn", status: "Todo" },
  { id: "2", title: "Pull Weeds", status: "In Progress" },
  { id: "3", title: "Rake the leaves", status: "Done" },
];

const statusOrder: TaskStatus[] = ["Todo", "In Progress", "Done"];

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const getTasksByStatus = useCallback(
    (status: TaskStatus): Task[] => {
      return tasks.filter((task) => task.status === status);
    },
    [tasks]
  );

  const addTask = useCallback((title: string) => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      status: "Todo",
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  }, []);

  const updateTaskStatus = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    },
    []
  );

  const moveTask = useCallback(
    (taskId: string, direction: "left" | "right") => {
      setTasks((prevTasks) => {
        const task = prevTasks.find((t) => t.id === taskId);
        if (!task) return prevTasks;

        const currentIndex = statusOrder.indexOf(task.status);
        let newIndex: number;

        if (direction === "left") {
          newIndex = Math.max(0, currentIndex - 1);
        } else {
          newIndex = Math.min(statusOrder.length - 1, currentIndex + 1);
        }

        const newStatus = statusOrder[newIndex];
        return prevTasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        );
      });
    },
    []
  );

  return (
    <TasksContext.Provider
      value={{ tasks, getTasksByStatus, addTask, moveTask, updateTaskStatus }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}

export function useTasksByStatus(status: TaskStatus): Task[] {
  const { getTasksByStatus } = useTasks();
  return useMemo(() => getTasksByStatus(status), [getTasksByStatus, status]);
}
