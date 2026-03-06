"use client";

import { useCallback } from "react";
import { updateTaskStatus } from "@/actions/tasks";
import { TaskCard } from "./task-card";
import type { Task, User } from "@prisma/client";
import type { TaskStatus } from "@prisma/client";

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: "TODO", label: "To Do", color: "border-t-slate-400" },
  { status: "IN_PROGRESS", label: "In Progress", color: "border-t-blue-500" },
  { status: "IN_REVIEW", label: "In Review", color: "border-t-amber-500" },
  { status: "DONE", label: "Done", color: "border-t-green-500" },
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
          className={`flex min-w-[280px] flex-1 flex-col rounded-lg border border-border border-t-4 ${col.color} bg-muted/20 p-4`}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-sm">{col.label}</h3>
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
              {tasksByStatus[col.status]?.length ?? 0}
            </span>
          </div>
          <div className="space-y-3 flex-1">
            {tasksByStatus[col.status]?.length === 0 ? (
              <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                No tasks
              </div>
            ) : (
              tasksByStatus[col.status]?.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  users={users}
                  onStatusChange={handleStatusChange}
                  view="kanban"
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
