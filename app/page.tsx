import Image from "next/image";
import Link from "next/link";
import { BILCLEANIKEN_LOGO_URL } from "@/lib/i18n/loyalty";
import { LoyaltyLookupForm } from "./loyalty-lookup-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-gray-50 to-blue-50">
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
        <Image
          src={BILCLEANIKEN_LOGO_URL}
          alt="Bilcleaniken"
          width={200}
          height={56}
          className="mb-8 h-12 w-auto sm:h-14"
          priority
        />

        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
          Biltvätt i Malmö
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Lojalitetskort</h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
          Ange ditt telefonnummer för att se dina poäng. Lojalitetssidan finns
          på{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700">
            /loyalty/[telefon]
          </code>
          .
        </p>

        <div className="mt-8 w-full flex justify-center">
          <LoyaltyLookupForm />
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Exempel:{" "}
          <Link
            href="/loyalty/0701234567"
            className="font-medium text-blue-700 underline-offset-2 hover:underline"
          >
            /loyalty/0701234567
          </Link>
        </p>
      </main>
    </div>
  );
}
