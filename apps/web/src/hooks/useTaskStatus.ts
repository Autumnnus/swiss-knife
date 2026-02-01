import { apiClient } from "@/lib/api";
import { useEffect, useState } from "react";

export type TaskStatus = "PENDING" | "PROCESSING" | "SUCCESS" | "FAILURE";

interface TaskResponse {
  task_id: string;
  status: TaskStatus;
  result?: any;
  step?: string;
  error?: string;
}

export function useTaskStatus(taskId: string | null) {
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [data, setData] = useState<TaskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;

    // eslint-disable-next-line prefer-const
    let intervalId: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const response = await apiClient<TaskResponse>(`/tasks/${taskId}`);
        setData(response);

        const currentStatus = response.status.toUpperCase() as TaskStatus;
        setStatus(currentStatus);

        if (currentStatus === "SUCCESS" || currentStatus === "FAILURE") {
          clearInterval(intervalId);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to poll task status",
        );
        clearInterval(intervalId);
      }
    };

    // Check immediately then poll
    checkStatus();
    intervalId = setInterval(checkStatus, 2000);

    return () => clearInterval(intervalId);
  }, [taskId]);

  return { status, data, error };
}
