"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle, ArrowDownLeft } from "lucide-react";

const FIRST_NAMES = [
  "James", "Mary", "John", "Sarah", "David", "Ann", "Peter", "Grace",
  "Brian", "Faith", "Kevin", "Joy", "Victor", "Mercy", "Dennis", "Alice",
  "Collins", "Esther", "Eric", "Lydia", "George", "Nancy", "Samuel", "Rose",
  "Patrick", "Diana", "Martin", "Catherine", "Daniel", "Winnie", "Stephen", "Lilian",
  "Moses", "Pauline", "Charles", "Janet", "Henry", "Irene", "Felix", "Agnes",
];

const AMOUNTS = [500, 550, 600, 700, 750, 800, 850, 900, 950, 1000, 1100, 1200, 1350, 1500, 1800, 2000, 2500, 3000];

function maskPhone() {
  const prefix = Math.random() > 0.5 ? "07" : "01";
  const mid = String(Math.floor(Math.random() * 100)).padStart(2, "0");
  return `${prefix}XX-XXX-${mid}`;
}

function randomEntry() {
  const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const amount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];
  const secsAgo = Math.floor(Math.random() * 55) + 5;
  return {
    id: Math.random().toString(36).slice(2, 9),
    name: `${name} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}.`,
    amount,
    phone: maskPhone(),
    time: `${secsAgo}s ago`,
  };
}

function initialFeed() {
  return Array.from({ length: 5 }, () => randomEntry());
}

export function LiveWithdrawFeed() {
  const [feed, setFeed] = useState(initialFeed);
  const [flash, setFlash] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const entry = randomEntry();
      entry.time = "just now";
      setFeed((prev) => [entry, ...prev.slice(0, 7)]);
      setFlash(entry.id);
      setTimeout(() => setFlash(null), 1200);
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="space-y-1.5 max-h-[320px] overflow-y-auto">
      {feed.map((entry) => (
        <div
          key={entry.id}
          className={`flex items-center gap-3 rounded-lg border border-border/40 px-3 py-2.5 transition-all duration-500 ${
            flash === entry.id
              ? "bg-emerald-500/10 border-emerald-500/30"
              : "bg-card"
          }`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
            <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{entry.name}</p>
            <p className="text-[11px] text-muted-foreground">{entry.phone}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-semibold text-emerald-500">
              KES {entry.amount.toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 justify-end">
              <CheckCircle className="h-3 w-3 text-emerald-500" />
              {entry.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
