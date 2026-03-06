import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivationForm } from "@/components/wallet/activation-form";
import { CheckCircle } from "lucide-react";

export default async function ActivatePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isActive: true },
  });

  const settings = await prisma.globalSettings.findFirst({
    select: { activationFeeAmount: true },
  });
  const activationFee = Number(settings?.activationFeeAmount ?? 100);

  if (user?.isActive) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle>Account Active</CardTitle>
            <CardDescription>Your account is already activated. You can earn referral bonuses and withdraw funds.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activate Account</h1>
        <p className="text-muted-foreground">Pay the one-time activation fee to unlock all platform features</p>
      </div>

      <div className="max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>One-Time Activation</CardTitle>
            <CardDescription>
              Pay KES {activationFee} via M-Pesa to activate your account. After activation you can:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">✓ Earn referral bonuses when people you refer activate</li>
              <li className="flex items-center gap-2">✓ Withdraw your wallet balance</li>
              <li className="flex items-center gap-2">✓ Access all platform features</li>
            </ul>
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <p className="text-sm text-muted-foreground">Activation Fee</p>
              <p className="text-4xl font-bold text-primary">KES {activationFee}</p>
            </div>
            <ActivationForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
