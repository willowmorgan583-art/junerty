import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      reference?: string;
      status?: string;
      transaction_id?: string;
    };

    const { reference, status, transaction_id } = body;

    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    const tx = await prisma.transaction.findUnique({ where: { reference } });
    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const isSuccess = ["success", "completed"].includes((status ?? "").toLowerCase());
    const newStatus = isSuccess ? "COMPLETED" : "FAILED";

    await prisma.transaction.update({
      where: { reference },
      data: {
        status: newStatus,
        metadata: { transaction_id },
      },
    });

    if (isSuccess) {
      if (tx.type === "ACTIVATION") {
        const user = await prisma.user.update({
          where: { id: tx.userId },
          data: { isActive: true },
          select: { referredById: true, id: true },
        });

        if (user.referredById) {
          const settings = await prisma.globalSettings.findFirst();
          const bonus = Number(settings?.referralBonusAmount ?? 100);

          await prisma.$transaction([
            prisma.user.update({
              where: { id: user.referredById },
              data: { walletBalance: { increment: bonus } },
            }),
            prisma.transaction.create({
              data: {
                userId: user.referredById,
                type: "REFERRAL_BONUS",
                amount: bonus,
                status: "COMPLETED",
                reference: `REF-BONUS-${user.id}-${Date.now()}`,
                description: `Referral bonus for activating user`,
              },
            }),
          ]);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
