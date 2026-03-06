import { getDashboardMetrics } from "@/actions/dashboard";
import { getWalletData } from "@/actions/wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DashboardBarChart,
  DashboardPieChart,
} from "@/components/dashboard/dashboard-charts";
import {
  CheckSquare,
  Users,
  TrendingUp,
  ListTodo,
  WalletIcon,
  ArrowUpRight,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
};

const STATUS_COLORS: Record<string, string> = {
  TODO: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  IN_PROGRESS: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  IN_REVIEW: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  DONE: "bg-green-500/10 text-green-600 dark:text-green-400",
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  MEDIUM: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  HIGH: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  URGENT: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export default async function DashboardPage() {
  const [metrics, walletData] = await Promise.all([
    getDashboardMetrics(),
    getWalletData(),
  ]);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const statusData = [
    {
      name: "To Do",
      value: metrics.tasksByStatus.TODO,
      color: "#94a3b8",
    },
    {
      name: "In Progress",
      value: metrics.tasksByStatus.IN_PROGRESS,
      color: "#3b82f6",
    },
    {
      name: "In Review",
      value: metrics.tasksByStatus.IN_REVIEW,
      color: "#f59e0b",
    },
    {
      name: "Done",
      value: metrics.tasksByStatus.DONE,
      color: "#22c55e",
    },
  ].filter((d) => d.value > 0);

  const barData = [
    { status: "To Do", count: metrics.tasksByStatus.TODO },
    { status: "In Progress", count: metrics.tasksByStatus.IN_PROGRESS },
    { status: "In Review", count: metrics.tasksByStatus.IN_REVIEW },
    { status: "Done", count: metrics.tasksByStatus.DONE },
  ];

  const inProgressCount = metrics.tasksByStatus.IN_PROGRESS;
  const inReviewCount = metrics.tasksByStatus.IN_REVIEW;
  const urgentTasks = metrics.recentTasks.filter(
    (t) => t.priority === "URGENT" && t.status !== "DONE"
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your tasks and activity
          </p>
        </div>
        <Link href="/tasks">
          <Button className="gap-2">
            <ListTodo className="h-4 w-4" />
            View All Tasks
          </Button>
        </Link>
      </div>

      {/* Alert for urgent tasks */}
      {urgentTasks.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              {urgentTasks.length} urgent task{urgentTasks.length > 1 ? "s" : ""}{" "}
              need attention
            </p>
            <p className="text-xs text-red-600 dark:text-red-300">
              {urgentTasks.length <= 3
                ? urgentTasks.map((t) => t.title).join(", ")
                : `${urgentTasks.slice(0, 3).map((t) => t.title).join(", ")} and ${urgentTasks.length - 3} more`}
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              Across all statuses
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.completionRate.toFixed(1)}% completion rate
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">
              {inReviewCount} in review
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.userCount}</div>
            <p className="text-xs text-muted-foreground">Total users</p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet</CardTitle>
            <WalletIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {Number(walletData?.user?.walletBalance ?? 0).toFixed(2)}
            </div>
            <Link href="/wallet">
              <p className="text-xs text-primary hover:underline cursor-pointer flex items-center gap-1">
                {walletData?.user?.isActive
                  ? "Manage wallet"
                  : "Activate account"}
                <ArrowUpRight className="h-3 w-3" />
              </p>
            </Link>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-pink-600" />
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Status</CardTitle>
            <CardDescription>
              Distribution across workflow stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardBarChart data={barData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
            <CardDescription>Visual composition of tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardPieChart data={statusData} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your latest activity</CardDescription>
          </div>
          <Link href="/tasks">
            <Button variant="outline" size="sm" className="gap-1">
              View all
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {metrics.recentTasks.length === 0 ? (
            <div className="py-12 text-center">
              <CheckSquare className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No tasks yet.</p>
              <Link href="/tasks">
                <Button variant="outline" className="mt-4" size="sm">
                  Create your first task
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {metrics.recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        task.status === "DONE"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      {task.status === "DONE" ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {task.assignedTo?.name ?? "Unassigned"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`hidden sm:inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        PRIORITY_COLORS[task.priority] ?? ""
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[task.status] ?? ""
                      }`}
                    >
                      {STATUS_LABELS[task.status] ?? task.status}
                    </span>
                    <span className="hidden sm:block text-xs text-muted-foreground">
                      {formatDate(task.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
