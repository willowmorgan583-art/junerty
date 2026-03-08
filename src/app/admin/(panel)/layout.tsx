import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: "Admin Console | SYNTHGRAPHIX",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true, email: true },
  });

  if (user?.role !== "ADMIN") redirect("/admin/login");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-white/[0.06] bg-slate-950/80 px-6 backdrop-blur-sm">
          <div className="pl-12 lg:pl-0">
            <h2 className="text-sm font-semibold text-white/80">Admin Console</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-white/70">{user?.name ?? "Admin"}</p>
              <p className="text-[10px] text-white/30">{user?.email}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-xs font-bold text-violet-300 ring-1 ring-violet-500/10">
              {(user?.name ?? "A")[0].toUpperCase()}
            </div>
          </div>
        </header>
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 pb-8 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
