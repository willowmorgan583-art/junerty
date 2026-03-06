import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";

interface LipanaCredentials {
  apiKey: string;
  secretKey: string;
  merchantId: string;
}

interface STKPushParams {
  phone: string;
  amount: number;
  reference: string;
  description: string;
  callbackUrl: string;
}

interface WithdrawParams {
  phone: string;
  amount: number;
  reference: string;
  network: "mpesa" | "airtel";
  description: string;
}

interface LipanaResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  checkoutRequestId?: string;
  transactionId?: string;
}

async function getCredentials(): Promise<LipanaCredentials> {
  const settings = await prisma.globalSettings.findFirst();
  if (!settings?.lipanaCredentials) {
    throw new Error("Lipana credentials not configured");
  }
  const decrypted = decrypt(settings.lipanaCredentials);
  return JSON.parse(decrypted) as LipanaCredentials;
}

export async function initiateSTKPush(params: STKPushParams): Promise<LipanaResponse> {
  const creds = await getCredentials();
  const res = await fetch("https://api.lipana.dev/v1/stk-push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": creds.apiKey,
      "x-secret-key": creds.secretKey,
    },
    body: JSON.stringify({
      merchant_id: creds.merchantId,
      phone: params.phone,
      amount: params.amount,
      reference: params.reference,
      description: params.description,
      callback_url: params.callbackUrl,
    }),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(`Lipana STK push failed: ${errBody.message ?? res.statusText}`);
  }
  return res.json() as Promise<LipanaResponse>;
}

export async function initiateWithdrawal(params: WithdrawParams): Promise<LipanaResponse> {
  const creds = await getCredentials();
  const res = await fetch("https://api.lipana.dev/v1/withdraw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": creds.apiKey,
      "x-secret-key": creds.secretKey,
    },
    body: JSON.stringify({
      merchant_id: creds.merchantId,
      phone: params.phone,
      amount: params.amount,
      reference: params.reference,
      network: params.network,
      description: params.description,
    }),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(`Lipana withdrawal failed: ${errBody.message ?? res.statusText}`);
  }
  return res.json() as Promise<LipanaResponse>;
}
