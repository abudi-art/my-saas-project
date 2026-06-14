"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoyaltyLookupForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = phone.trim();
    if (!trimmed) return;
    router.push(`/loyalty/${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 text-left">
      <label className="block">
        <span className="text-sm font-medium text-[#1E293B]">
          Telefonnummer / Phone
        </span>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0701234567"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[#1E293B] shadow-sm outline-none ring-[#004a80] focus:ring-2"
        />
      </label>
      <button
        type="submit"
        className="loyalty-btn-primary w-full px-4 py-3 text-sm"
      >
        Visa lojalitetspoäng
      </button>
    </form>
  );
}
