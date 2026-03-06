"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getNotifications() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

export async function markNotificationRead(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.notification.update({
    where: { id },
    data: { read: true },
  });

  revalidatePath("/dashboard");
}

export async function markAllNotificationsRead() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.notification.updateMany({
    where: { userId: session.user.id },
    data: { read: true },
  });

  revalidatePath("/dashboard");
}
