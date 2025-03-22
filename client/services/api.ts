import axios, { AxiosError } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  assignedTo: string;
}

export type CreateTaskDTO = Omit<Task, "id">;
export type UpdateTaskDTO = Partial<Task>;

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      throw new ApiError(
        error.response.status,
        (error.response.data as string) || "An error occurred"
      );
    }
    throw new Error("Network error");
  }
);

export const taskApi = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>("/tasks");
    return response.data;
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (task: CreateTaskDTO): Promise<Task> => {
    const response = await api.post<Task>("/tasks", task);
    return response.data;
  },

  updateTask: async (id: string, task: UpdateTaskDTO): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, task);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

// Re-export as taskService for backward compatibility
export const taskService = taskApi;
