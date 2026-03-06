"use client";

import { TaskCard } from "./task-card";
import type { Task, User } from "@prisma/client";

type TaskWithRelations = Task & {
  assignedTo: Pick<User, "id" | "name" | "email"> | null;
  createdBy: { id: string; name: string | null };
};

export function TasksList({
  tasks,
  users,
}: {
  tasks: TaskWithRelations[];
  users: Pick<User, "id" | "name" | "email">[];
}) {
  return (
    <div className="space-y-2">
      {tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
          No tasks yet. Create one to get started.
        </div>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task.id} task={task} users={users} view="list" />
        ))
      )}
    </div>
  );
}
