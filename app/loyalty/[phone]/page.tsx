import { createClient } from "@supabase/supabase-js";
import { LoyaltyView } from "./loyalty-view";

type PageProps = {
  params: Promise<{ phone: string }>;
};

export default async function LoyaltyPage({ params }: PageProps) {
  const { phone } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase
    .from("loyalty_data")
    .select("*")
    .eq("phone", phone)
    .single();

  const notFound = error?.code === "PGRST116" || (!data && !!error);

  return (
    <LoyaltyView
      phone={phone}
      customer={notFound ? null : data}
      configError={!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
    />
  );
}
