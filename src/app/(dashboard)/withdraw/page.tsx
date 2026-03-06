import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WithdrawForm } from "@/components/wallet/withdraw-form";

export default async function WithdrawPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isActive: true, walletBalance: true },
  });

  const settings = await prisma.globalSettings.findFirst({
    select: { minWithdrawalAmount: true },
  });
  const minWithdrawal = Number(settings?.minWithdrawalAmount ?? 500);
  const balance = Number(user?.walletBalance ?? 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Withdraw Funds</h1>
        <p className="text-muted-foreground">Transfer your wallet balance to M-Pesa or Airtel Money</p>
      </div>

      <div className="max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Withdraw</CardTitle>
            <CardDescription>
              Available balance: <strong>KES {balance.toFixed(2)}</strong>
              {" • "}Minimum: <strong>KES {minWithdrawal}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!user?.isActive ? (
              <p className="text-sm text-destructive">
                Your account must be active to withdraw funds. Please{" "}
                <a href="/activate" className="underline">activate your account</a> first.
              </p>
            ) : balance < minWithdrawal ? (
              <p className="text-sm text-muted-foreground">
                Your balance (KES {balance.toFixed(2)}) is below the minimum withdrawal amount of KES {minWithdrawal}.
              </p>
            ) : (
              <WithdrawForm balance={balance} minWithdrawal={minWithdrawal} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
