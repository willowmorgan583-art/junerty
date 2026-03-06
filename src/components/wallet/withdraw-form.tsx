"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestWithdrawal } from "@/actions/wallet";

interface WithdrawFormProps {
  balance: number;
  minWithdrawal: number;
}

export function WithdrawForm({ balance, minWithdrawal }: WithdrawFormProps) {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState<"mpesa" | "airtel">("mpesa");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await requestWithdrawal(phone, Number(amount), network);
      setMessage({ type: "success", text: result.message });
      setPhone("");
      setAmount("");
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Withdrawal failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`rounded-lg p-3 text-sm ${message.type === "success" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"}`}>
          {message.text}
        </div>
      )}
      <div className="space-y-2">
        <Label>Network</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={network === "mpesa" ? "default" : "outline"}
            size="sm"
            onClick={() => setNetwork("mpesa")}
          >
            M-Pesa
          </Button>
          <Button
            type="button"
            variant={network === "airtel" ? "default" : "outline"}
            size="sm"
            onClick={() => setNetwork("airtel")}
          >
            Airtel Money
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="254712345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (KES)</Label>
        <Input
          id="amount"
          type="number"
          placeholder={minWithdrawal.toString()}
          min={minWithdrawal}
          max={balance}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">Min: KES {minWithdrawal} • Available: KES {balance.toFixed(2)}</p>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Processing..." : "Withdraw"}
      </Button>
    </form>
  );
}
