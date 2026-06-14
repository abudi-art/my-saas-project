import Link from "next/link";
import { BrandTopBar } from "@/components/loyalty/brand-top-bar";
import { LoyaltyLookupForm } from "./loyalty-lookup-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <BrandTopBar />

      <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-lg flex-col justify-center px-4 py-8 sm:px-6">
        <article className="loyalty-card-surface rounded-2xl p-8 text-center shadow-[0_8px_30px_rgba(0,74,128,0.08)]">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#004a80]">
            Biltvätt i Malmö
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#1E293B]">
            Lojalitetskort
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm font-medium leading-relaxed text-[#1E293B]/70">
            Ange ditt telefonnummer för att se dina poäng. Lojalitetssidan finns
            på{" "}
            <code className="rounded-lg bg-[#F8FAFC] px-1.5 py-0.5 text-xs text-[#1E293B]">
              /loyalty/[telefon]
            </code>
            .
          </p>

          <div className="mt-8 flex justify-center">
            <LoyaltyLookupForm />
          </div>

          <p className="mt-6 text-xs font-medium text-[#1E293B]/50">
            Exempel:{" "}
            <Link
              href="/loyalty/0701234567"
              className="text-[#004a80] underline-offset-2 hover:underline"
            >
              /loyalty/0701234567
            </Link>
          </p>
        </article>
      </main>
    </div>
  );
}
