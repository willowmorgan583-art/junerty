"use client";

interface WeekDatum {
  day: string;
  users: number;
  active: number;
}

export function AdminRegistrationChart({ data }: { data: WeekDatum[] }) {
  const maxVal = Math.max(...data.map((d) => Math.max(d.users, d.active)), 1);

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-gradient-to-r from-violet-500 to-violet-400" />
          <span className="text-xs text-white/50">Registrations</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-gradient-to-r from-emerald-500 to-emerald-400" />
          <span className="text-xs text-white/50">Activations</span>
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.day} className="group">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-white/40">{d.day}</span>
              <span className="text-[10px] text-white/30">
                {d.users} / {d.active}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-700"
                  style={{ width: `${(d.users / maxVal) * 100}%` }}
                />
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700"
                  style={{ width: `${(d.active / maxVal) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface MetricRingProps {
  label: string;
  value: number;
  max: number;
  color: string;
  suffix?: string;
}

export function MetricRing({ label, value, max, color, suffix = "" }: MetricRingProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-white">{pct.toFixed(0)}{suffix}</span>
        </div>
      </div>
      <span className="text-[11px] font-medium text-white/40">{label}</span>
    </div>
  );
}

interface RevenueBarProps {
  data: { label: string; amount: number }[];
}

export function RevenueChart({ data }: RevenueBarProps) {
  const maxVal = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div className="flex items-end gap-2 h-[160px]">
      {data.map((d) => {
        const h = Math.max((d.amount / maxVal) * 100, 4);
        return (
          <div key={d.label} className="group flex flex-1 flex-col items-center gap-2">
            <div className="relative w-full flex justify-center">
              <div
                className="w-8 rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-400 transition-all duration-500 group-hover:from-indigo-500 group-hover:to-violet-300"
                style={{ height: `${h}%`, minHeight: "4px" }}
              />
              <div className="absolute -top-5 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold text-white/70 whitespace-nowrap">
                KES {d.amount.toLocaleString()}
              </div>
            </div>
            <span className="text-[10px] text-white/30 font-medium">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

interface ActivityItem {
  label: string;
  count: number;
  color: string;
}

export function ActivityBreakdown({ items, total }: { items: ActivityItem[]; total: number }) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const pct = total > 0 ? (item.count / total) * 100 : 0;
        return (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                <span className="text-xs text-white/50">{item.label}</span>
              </div>
              <span className="text-xs font-semibold text-white/70">{item.count.toLocaleString()}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: item.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
