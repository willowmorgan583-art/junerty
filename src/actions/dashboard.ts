"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getDashboardMetrics() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  const [
    totalTasks,
    completedTasks,
    tasksByStatus,
    recentTasks,
    userCount,
  ] = await Promise.all([
    prisma.task.count({
      where: {
        OR: [{ createdById: userId }, { assignedToId: userId }],
      },
    }),
    prisma.task.count({
      where: {
        status: "DONE",
        OR: [{ createdById: userId }, { assignedToId: userId }],
      },
    }),
    prisma.task.groupBy({
      by: ["status"],
      where: {
        OR: [{ createdById: userId }, { assignedToId: userId }],
      },
      _count: true,
    }),
    prisma.task.findMany({
      where: {
        OR: [{ createdById: userId }, { assignedToId: userId }],
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        assignedTo: { select: { name: true, email: true } },
      },
    }),
    prisma.user.count(),
  ]);

  const statusMap = Object.fromEntries(
    tasksByStatus.map((s) => [s.status, s._count])
  );

  return {
    totalTasks,
    completedTasks,
    completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    tasksByStatus: {
      TODO: statusMap.TODO ?? 0,
      IN_PROGRESS: statusMap.IN_PROGRESS ?? 0,
      IN_REVIEW: statusMap.IN_REVIEW ?? 0,
      DONE: statusMap.DONE ?? 0,
    },
    recentTasks,
    userCount,
  };
}
