import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "@/services/api";
import { Task, CreateTaskDTO, UpdateTaskDTO } from "@/services/types";
import { toast } from "@/components/ui/use-toast";

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  createTask: (task: CreateTaskDTO) => Promise<Task>;
  updateTask: (id: string, task: UpdateTaskDTO) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskApi.getTasks,
  });

  const createMutation = useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "Success", description: "Task created successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, task }: { id: string; task: UpdateTaskDTO }) =>
      taskApi.updateTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "Success", description: "Task updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "Success", description: "Task deleted successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  const value = {
    tasks,
    isLoading,
    error,
    createTask: createMutation.mutateAsync,
    updateTask: (id: string, task: UpdateTaskDTO) =>
      updateMutation.mutateAsync({ id, task }),
    deleteTask: deleteMutation.mutateAsync,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
