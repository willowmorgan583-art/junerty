"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { initiateSTKPush, initiateWithdrawal } from "@/lib/lipana";

export async function getWalletData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      isActive: true,
      walletBalance: true,
      referralCode: true,
      referredById: true,
      _count: { select: { referrals: true } },
    },
  });

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return { user, transactions };
}

export async function initiateActivation(phone: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("User not found");
  if (user.isActive) throw new Error("Account is already active");

  const settings = await prisma.globalSettings.findFirst();
  const activationFee = Number(settings?.activationFeeAmount ?? 100);

  const reference = `ACT-${user.id}-${Date.now()}`;

  const tx = await prisma.transaction.create({
    data: {
      userId: user.id,
      type: "ACTIVATION",
      amount: activationFee,
      status: "PENDING",
      reference,
      description: `Account activation fee`,
    },
  });

  try {
    const callbackUrl = process.env.AUTH_URL;
    if (!callbackUrl) throw new Error("AUTH_URL environment variable is not set");

    const result = await initiateSTKPush({
      phone,
      amount: activationFee,
      reference,
      description: "Account Activation",
      callbackUrl: `${callbackUrl}/api/lipana/webhook`,
    });

    if (!result.success) {
      await prisma.transaction.update({
        where: { id: tx.id },
        data: { status: "FAILED", metadata: { error: result.message } },
      });
      throw new Error(result.message || "Payment initiation failed");
    }

    await prisma.transaction.update({
      where: { id: tx.id },
      data: { metadata: { checkoutRequestId: result.checkoutRequestId } },
    });

    return { success: true, reference, message: "STK push sent. Check your phone to complete payment." };
  } catch (err) {
    await prisma.transaction.update({
      where: { id: tx.id },
      data: { status: "FAILED" },
    });
    throw err;
  }
}

export async function requestWithdrawal(phone: string, amount: number, network: "mpesa" | "airtel") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("User not found");
  if (!user.isActive) throw new Error("Your account must be active to withdraw");

  const settings = await prisma.globalSettings.findFirst();
  const minWithdrawal = Number(settings?.minWithdrawalAmount ?? 500);

  if (amount < minWithdrawal) {
    throw new Error(`Minimum withdrawal amount is KES ${minWithdrawal}`);
  }

  if (Number(user.walletBalance) < amount) {
    throw new Error("Insufficient wallet balance");
  }

  const reference = `WD-${user.id}-${Date.now()}`;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { walletBalance: { decrement: amount } },
    }),
    prisma.transaction.create({
      data: {
        userId: user.id,
        type: "WITHDRAWAL",
        amount,
        status: "PENDING",
        reference,
        description: `Withdrawal to ${phone} via ${network}`,
      },
    }),
  ]);

  try {
    const result = await initiateWithdrawal({
      phone,
      amount,
      reference,
      network,
      description: "Wallet Withdrawal",
    });

    if (!result.success) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: { walletBalance: { increment: amount } },
        }),
        prisma.transaction.updateMany({
          where: { reference },
          data: { status: "FAILED", metadata: { error: result.message } },
        }),
      ]);
      throw new Error(result.message || "Withdrawal failed");
    }

    revalidatePath("/wallet");
    return { success: true, reference, message: "Withdrawal initiated successfully." };
  } catch (err) {
    revalidatePath("/wallet");
    throw err;
  }
}

export async function getReferralStats() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      referralCode: true,
      walletBalance: true,
      isActive: true,
      referrals: {
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          createdAt: true,
        },
      },
    },
  });

  return user;
}
