import { useTaskContext } from "../contexts/TaskContexts";
import { Task } from "@/services/types";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";

export function TaskList() {
  const { tasks, isLoading, error, deleteTask } = useTaskContext();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      {tasks.map(
        (task: {
          id: Key | null | undefined;
          title:
            | string
            | number
            | bigint
            | boolean
            | ReactElement<unknown, string | JSXElementConstructor<any>>
            | Iterable<ReactNode>
            | ReactPortal
            | Promise<
                | string
                | number
                | bigint
                | boolean
                | ReactPortal
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | null
                | undefined
              >
            | null
            | undefined;
          description:
            | string
            | number
            | bigint
            | boolean
            | ReactElement<unknown, string | JSXElementConstructor<any>>
            | Iterable<ReactNode>
            | ReactPortal
            | Promise<
                | string
                | number
                | bigint
                | boolean
                | ReactPortal
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | null
                | undefined
              >
            | null
            | undefined;
          status:
            | string
            | number
            | bigint
            | boolean
            | ReactElement<unknown, string | JSXElementConstructor<any>>
            | Iterable<ReactNode>
            | ReactPortal
            | Promise<
                | string
                | number
                | bigint
                | boolean
                | ReactPortal
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | null
                | undefined
              >
            | null
            | undefined;
          priority:
            | string
            | number
            | bigint
            | boolean
            | ReactElement<unknown, string | JSXElementConstructor<any>>
            | Iterable<ReactNode>
            | ReactPortal
            | Promise<
                | string
                | number
                | bigint
                | boolean
                | ReactPortal
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | null
                | undefined
              >
            | null
            | undefined;
        }) => (
          <div key={task.id} className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <div className="flex gap-2 mt-2">
              <span className="badge">{task.status}</span>
              <span className="badge">{task.priority}</span>
            </div>
            <button
              onClick={() => task.id && deleteTask(task.id.toString())}
              className="btn btn-danger mt-2"
            >
              Delete
            </button>
          </div>
        )
      )}
    </div>
  );
}
