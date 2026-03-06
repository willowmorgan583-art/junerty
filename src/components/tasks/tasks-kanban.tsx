"use client";

import { useCallback } from "react";
import { updateTaskStatus } from "@/actions/tasks";
import { TaskCard } from "./task-card";
import type { Task, User } from "@prisma/client";
import type { TaskStatus } from "@prisma/client";

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "TODO", label: "To Do" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "IN_REVIEW", label: "In Review" },
  { status: "DONE", label: "Done" },
];

type TaskWithRelations = Task & {
  assignedTo: Pick<User, "id" | "name" | "email"> | null;
  createdBy: { id: string; name: string | null };
};

export function TasksKanban({
  tasks,
  users,
}: {
  tasks: TaskWithRelations[];
  users: Pick<User, "id" | "name" | "email">[];
}) {
  const handleStatusChange = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      await updateTaskStatus(taskId, newStatus);
    },
    []
  );

  const tasksByStatus = COLUMNS.reduce(
    (acc, col) => {
      acc[col.status] = tasks.filter((t) => t.status === col.status);
      return acc;
    },
    {} as Record<TaskStatus, TaskWithRelations[]>
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => (
        <div
          key={col.status}
          className="flex min-w-[280px] flex-1 flex-col rounded-lg border border-border bg-muted/30 p-4"
        >
          <h3 className="mb-4 font-semibold">
            {col.label} ({tasksByStatus[col.status]?.length ?? 0})
          </h3>
          <div className="space-y-3">
            {tasksByStatus[col.status]?.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                users={users}
                onStatusChange={handleStatusChange}
                view="kanban"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
