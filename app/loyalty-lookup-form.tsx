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
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <label className="block text-left">
        <span className="text-sm font-medium text-gray-600">
          Telefonnummer / Phone
        </span>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0701234567"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none ring-blue-600 focus:ring-2"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
      >
        Visa lojalitetspoäng
      </button>
    </form>
  );
}
