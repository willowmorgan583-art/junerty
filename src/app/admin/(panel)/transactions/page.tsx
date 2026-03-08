import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { ArrowLeftRight, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default async function AdminTransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const totalVolume = transactions.reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-white/30 mb-1">
          <span>Admin</span>
          <span className="text-white/10">/</span>
          <span className="text-white/60">Transactions</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">Transactions</h1>
        <p className="text-sm text-white/40 mt-0.5">All platform financial activity</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/30">Total Transactions</p>
          <p className="mt-2 text-3xl font-bold text-white">{transactions.length}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/30">Volume</p>
          <p className="mt-2 text-3xl font-bold text-white">KES {totalVolume.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 col-span-2 lg:col-span-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/30">Latest Activity</p>
          <p className="mt-2 text-lg font-bold text-white">
            {transactions.length > 0 ? formatDate(transactions[0].createdAt) : "None"}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="mb-4 flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4 text-white/30" />
          <h3 className="text-sm font-semibold text-white/80">Transaction History</h3>
        </div>

        {transactions.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/20">No transactions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["User", "Type", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-white/20">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {transactions.map((tx) => {
                  const isOut = tx.type === "WITHDRAWAL";
                  return (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-[11px] font-bold text-white/50">
                            {(tx.user.name ?? tx.user.email)[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white/80 truncate max-w-[140px]">{tx.user.name ?? tx.user.email}</p>
                            <p className="text-[10px] text-white/25 truncate max-w-[140px] hidden sm:block">{tx.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                          tx.type === "ACTIVATION" ? "bg-violet-500/10 text-violet-400" :
                          tx.type === "REFERRAL_BONUS" ? "bg-emerald-500/10 text-emerald-400" :
                          tx.type === "WITHDRAWAL" ? "bg-amber-500/10 text-amber-400" :
                          "bg-sky-500/10 text-sky-400"
                        }`}>
                          {isOut ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                          {tx.type.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-semibold ${isOut ? "text-amber-400" : "text-emerald-400"}`}>
                          {isOut ? "-" : "+"}KES {Number(tx.amount).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                          tx.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400" :
                          tx.status === "PENDING" ? "bg-amber-500/10 text-amber-400" :
                          tx.status === "FAILED" ? "bg-red-500/10 text-red-400" :
                          "bg-white/5 text-white/40"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            tx.status === "COMPLETED" ? "bg-emerald-400" :
                            tx.status === "PENDING" ? "bg-amber-400" :
                            tx.status === "FAILED" ? "bg-red-400" : "bg-white/20"
                          }`} />
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-white/25">{formatDate(tx.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
