import { createClient } from "@supabase/supabase-js";
import { getPhoneLookupVariants } from "@/lib/phone/normalize";

export type LoyaltyCustomer = {
  phone: string;
  points: number;
  customer_name?: string | null;
  [key: string]: unknown;
};

export async function fetchLoyaltyCustomerByPhone(
  rawPhone: string,
): Promise<{ customer: LoyaltyCustomer | null; error: boolean }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return { customer: null, error: true };
  }

  const phone = decodeURIComponent(rawPhone);
  const supabase = createClient(url, anonKey);
  const lookupVariants = getPhoneLookupVariants(phone);

  const { data, error } = await supabase
    .from("loyalty_data")
    .select("*")
    .in("phone", lookupVariants)
    .limit(1);

  if (error) {
    return { customer: null, error: true };
  }

  return { customer: data?.[0] ?? null, error: false };
}
