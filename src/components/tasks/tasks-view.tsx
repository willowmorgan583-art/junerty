"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TasksKanban } from "./tasks-kanban";
import { TasksList } from "./tasks-list";
import type { Task, User } from "@prisma/client";

type TaskWithRelations = Task & {
  assignedTo: Pick<User, "id" | "name" | "email"> | null;
  createdBy: { id: string; name: string | null };
};

export function TasksView({
  tasks,
  users,
}: {
  tasks: TaskWithRelations[];
  users: Pick<User, "id" | "name" | "email">[];
}) {
  const [view, setView] = useState<"kanban" | "list">("kanban");

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button
          variant={view === "kanban" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("kanban")}
        >
          <LayoutGrid className="mr-2 h-4 w-4" />
          Kanban
        </Button>
        <Button
          variant={view === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("list")}
        >
          <List className="mr-2 h-4 w-4" />
          List
        </Button>
      </div>

      {view === "kanban" ? (
        <TasksKanban tasks={tasks} users={users} />
      ) : (
        <TasksList tasks={tasks} users={users} />
      )}
    </div>
  );
}
