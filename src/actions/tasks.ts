"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { TaskStatus, Priority } from "@prisma/client";

export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const status = (formData.get("status") as TaskStatus) || "TODO";
  const priority = (formData.get("priority") as Priority) || "MEDIUM";
  const assignedToId = (formData.get("assignedToId") as string) || null;
  const dueDate = formData.get("dueDate")
    ? new Date(formData.get("dueDate") as string)
    : null;

  if (!title?.trim()) throw new Error("Title is required");

  await prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      status,
      priority,
      dueDate,
      createdById: session.user.id,
      assignedToId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}

export async function updateTask(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const status = formData.get("status") as TaskStatus;
  const priority = formData.get("priority") as Priority;
  const assignedToIdRaw = (formData.get("assignedToId") as string) || "";
  const assignedToId = assignedToIdRaw.trim() || null;
  const dueDateVal = formData.get("dueDate") as string;
  const dueDate = dueDateVal ? new Date(dueDateVal) : null;

  await prisma.task.update({
    where: { id },
    data: {
      ...(title && { title: title.trim() }),
      ...(description !== undefined && { description: description?.trim() || null }),
      ...(status && { status }),
      ...(priority && { priority }),
      assignedToId,
      dueDate,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.task.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}

export async function deleteTask(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.task.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}
