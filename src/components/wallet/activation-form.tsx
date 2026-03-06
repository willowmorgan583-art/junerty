"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initiateActivation } from "@/actions/wallet";

export function ActivationForm() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await initiateActivation(phone);
      setMessage({ type: "success", text: result.message });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to initiate payment" });
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
        <Label htmlFor="phone">M-Pesa Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="254712345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">Format: 254XXXXXXXXX (without +)</p>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Initiating payment..." : "Pay & Activate"}
      </Button>
    </form>
  );
}
