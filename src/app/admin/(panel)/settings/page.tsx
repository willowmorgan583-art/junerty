import { prisma } from "@/lib/prisma";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";
import { Settings } from "lucide-react";

export default async function AdminSettingsPage() {
  const settings = await prisma.globalSettings.findFirst();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-white/30 mb-1">
          <span>Admin</span>
          <span className="text-white/10">/</span>
          <span className="text-white/60">Settings</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">Platform Settings</h1>
        <p className="text-sm text-white/40 mt-0.5">Configure fees, bonuses, and integrations</p>
      </div>

      <div className="max-w-2xl">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="mb-6 flex items-center gap-2">
            <Settings className="h-4 w-4 text-white/40" />
            <h3 className="text-sm font-semibold text-white/80">Configuration</h3>
          </div>
          <AdminSettingsForm
            initialValues={{
              activationFeeAmount: Number(settings?.activationFeeAmount ?? 100),
              referralBonusAmount: Number(settings?.referralBonusAmount ?? 100),
              minWithdrawalAmount: Number(settings?.minWithdrawalAmount ?? 500),
              whatsappNumber: settings?.whatsappNumber ?? "",
            }}
          />
        </div>
      </div>
    </div>
  );
}
