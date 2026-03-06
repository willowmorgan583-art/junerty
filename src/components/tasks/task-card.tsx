"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditTaskDialog } from "./edit-task-dialog";
import { deleteTask, updateTaskStatus } from "@/actions/tasks";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Task, User } from "@prisma/client";
import type { TaskStatus } from "@prisma/client";

type TaskWithRelations = Task & {
  assignedTo: Pick<User, "id" | "name" | "email"> | null;
  createdBy: { id: string; name: string | null };
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-slate-500/20 text-slate-600 dark:text-slate-400",
  MEDIUM: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  HIGH: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  URGENT: "bg-red-500/20 text-red-600 dark:text-red-400",
};

export function TaskCard({
  task,
  users,
  onStatusChange,
  view = "kanban",
}: {
  task: TaskWithRelations;
  users: Pick<User, "id" | "name" | "email">[];
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  view?: "kanban" | "list";
}) {
  const [editOpen, setEditOpen] = useState(false);

  async function handleDelete() {
    try {
      await deleteTask(task.id);
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  }

  async function handleStatusChange(value: TaskStatus) {
    try {
      await updateTaskStatus(task.id, value);
      onStatusChange?.(task.id, value);
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  }

  const priorityColor = PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS.MEDIUM;

  if (view === "list") {
    return (
      <>
        <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{task.title}</p>
            <p className="text-sm text-muted-foreground">
              {task.assignedTo?.name ?? "Unassigned"} •{" "}
              {task.dueDate ? formatDate(task.dueDate) : "No due date"}
            </p>
          </div>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              priorityColor
            )}
          >
            {task.priority}
          </span>
          <Select
            value={task.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODO">To Do</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="IN_REVIEW">In Review</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <EditTaskDialog
          task={task}
          users={users}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      </>
    );
  }

  return (
    <>
      <div
        className={cn(
          "rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
          "cursor-grab active:cursor-grabbing"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{task.title}</p>
            {task.description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  priorityColor
                )}
              >
                {task.priority}
              </span>
              {task.dueDate && (
                <span className="text-xs text-muted-foreground">
                  {formatDate(task.dueDate)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {task.assignedTo?.name ?? "Unassigned"}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-3">
          <Select value={task.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODO">To Do</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="IN_REVIEW">In Review</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <EditTaskDialog
        task={task}
        users={users}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
