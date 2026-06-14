import { createClient } from "@supabase/supabase-js";
import { resolveServerAppUrl } from "@/lib/loyalty/stamps";
import { getPhoneLookupVariants } from "@/lib/phone/normalize";
import { LoyaltyView } from "./loyalty-view";

type PageProps = {
  params: Promise<{ phone: string }>;
};

export default async function LoyaltyPage({ params }: PageProps) {
  const { phone: rawPhone } = await params;
  const phone = decodeURIComponent(rawPhone);
  const lookupVariants = getPhoneLookupVariants(phone);

  console.log("loyalty lookup phone:", phone);
  console.log("loyalty lookup variants:", lookupVariants);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase
    .from("loyalty_data")
    .select("*")
    .in("phone", lookupVariants)
    .limit(1);

  if (error) {
    console.log("loyalty lookup error:", error.message, error.code);
  }

  const customer = data?.[0] ?? null;
  const notFound = !customer;

  return (
    <LoyaltyView
      phone={phone}
      customer={notFound ? null : customer}
      appUrl={resolveServerAppUrl()}
      configError={
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    />
  );
}
