export function getPhoneLookupVariants(rawPhone: string): string[] {
  const decoded = decodeURIComponent(rawPhone).trim();
  const digits = decoded.replace(/\D/g, "");

  const variants = new Set<string>();

  if (decoded) variants.add(decoded);
  if (digits) variants.add(digits);

  if (digits.startsWith("46") && digits.length > 2) {
    const local = digits.slice(2);
    variants.add(local);
    variants.add(`0${local}`);
  }

  if (digits.startsWith("0") && digits.length > 1) {
    variants.add(digits.slice(1));
    variants.add(`46${digits.slice(1)}`);
  } else if (digits.length >= 7) {
    variants.add(`0${digits}`);
    variants.add(`46${digits}`);
  }

  return [...variants].filter(Boolean);
}
