"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  FileText,
  Settings,
  LogOut,
  ShieldCheck,
  X,
  Menu,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/admin/transcriptions", label: "Transcriptions", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-slate-900/90 backdrop-blur-sm text-white/60 hover:text-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/[0.06] bg-slate-950 transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <BrandLogo href="/admin/dashboard" size={32} showName={false} />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-wide">SYNTHGRAPHIX</span>
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-violet-400">
                <ShieldCheck className="h-2.5 w-2.5" />
                Admin
              </span>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/20">
            Navigation
          </p>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-violet-500/15 to-indigo-500/10 text-white shadow-sm shadow-violet-500/5"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                    active
                      ? "bg-violet-500/20 text-violet-400"
                      : "bg-white/[0.04] text-white/40 group-hover:bg-white/[0.08] group-hover:text-white/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {label}
                {active && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-white/[0.06] p-3">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/40 hover:bg-white/[0.04] hover:text-white/60 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            User Dashboard
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
              <LogOut className="h-4 w-4" />
            </div>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
