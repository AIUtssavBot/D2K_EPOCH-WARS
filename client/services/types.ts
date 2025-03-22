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
